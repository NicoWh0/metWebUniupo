'use strict';
// import package
const express = require('express') ;
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

//validation middle-ware
const {check, validationResult} = require('express-validator');

const userDao = new (require('./user-dao'))();
const imageDao = new (require('./image-dao'))();
const commentDao = new (require('./comment-dao'))();

const app = express();

const port = 3000;

const tempStorePath = 'db_images/tmp/';
const storePath = 'db_images/:id/';
const imageStorePath = storePath + 'published/';

//Multer

const imageStorage = multer.diskStorage(
    {
        destination: function(_req, _file, cb) {
            cb(null, tempStorePath);
        },
        filename: function(req, file, cb) {
            req.body['originalfilename'] = file.originalname;
            cb(null, file.originalname);
        }
    }
)

const storeImage = multer({
    storage: imageStorage,
    limits: {
        field: 8 * 1024 * 1024 //8 MB
    },
    fileFilter: function(req, file, cb) {
        const extention = path.extname(file.originalname);
        if(req.isAuthenticated() && (extention === '.jpg' || extention === '.jpeg' || extention === '.png'))
            cb(null, true);
        cb(null, false);
    }
}).single('imageFile');


// set-up logging
app.use(morgan('tiny'));

// process body content as JSON
app.use(express.json());

// set up the 'public' component as a static website 
app.use(express.static('public'));

//Enum for the categories
imageDao.getAllCategories().then(result => app.set('categories', result)).catch(err => {throw err});

//Passport

passport.use(new LocalStrategy(
    function(username, password, done) {
        userDao.loginUser(username, password).then(({user, pass}) => {
            if(!user) done(null, false, {message: 'Username non trovato.'});
            else if(!pass) done(null, false, {message: 'Password errata.'});
            else done(null, user);
        }).catch(err => done(err));
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    userDao.getUserInfoById(id).then(user => {
        done(null, user);
    }).catch(err => done(err));
});


app.use(session({
    secret: 'The secret sentence of this session. Must not share with anyone.',
    saveUninitialized: false,
    resave: false,
    cookie: {
        sameSite: 'lax',
        httpOnly: true,
        secure: false,
        maxAge: 3600000 // 1 hour
    }
}));
app.use(passport.initialize());
app.use(passport.session());


const isLogged = function(req, res, next) {
    if(req.isAuthenticated()) next();
    else res.status(401).json({error: 'Non autenticato.'});
}
//Il check se è admin è fatto già nelle routes


//REST API

app.get('/imageFile/:userId/:type/:filename', (req, res) => {
    const { userId, type, filename } = req.params;
    
    // Build the file path
    const filePath = path.join(
        __dirname,
        'db_images',
        userId,
        type, // 'published' is the default
        filename
    );

    // Send the file or a default image if not found
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('Image not found');
        }
    });
});

app.get('/favicon.ico', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.png'));
});

app.get('/favicon.png', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.png'));
});

app.get('/categories', (req, res) => {
    return res.status(200).json({categories: req.app.get('categories')});
});

app.post('/register', 
    [
        check(['username', 'email', 'password', 'confirmPassword'], 'Parametri mancanti o dal formato errato.').isString(),
        check('username', "L'username deve essere lungo dai 4 ai 20 caratteri e può contenere solo lettere, numeri o underscore").trim().isLength({max: 20, min: 4}).matches(/[a-zA-Z0-9_]+/),
        check('password', 'La password deve essere lunga dai 8 ai 16 caratteri e deve contenere almeno un numero, una lettera maiuscola, una lettera minuscola e un carattere speciale.').isLength({max: 16, min: 8}).isStrongPassword(),
        check('email', 'Inserire un indirizzo mail valido').trim().isEmail(),
        check('confirmPassword').custom((value, {req}) => {
            return value === req.body.password ? Promise.resolve('Ok.') : Promise.reject('La password originale e quella di conferma devono combaciare.');
        })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});
        
        userDao.registerUser(req.body).then(id => {
            fs.mkdirSync(imageStorePath.replace(':id', id), {recursive: true});
            return res.status(201).end();
        }).catch(err => {
            if(err.errno === 19 && err.code === 'SQLITE_CONSTRAINT' && err.message.match(/UNIQUE constraint failed/)) {
                return res.status(409).json({message: 'Username o Email già in uso da un altro account.'});
            }
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
);


app.post('/login', check(['username', 'password']).notEmpty(), function(req, res, next) {   
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});

    passport.authenticate('local', function(err, user, info) {
        if(err) next(err); //l'error handling è lasciato ad express
        else if(!user) {
            res.status(401).json(info);
        }
        else {
            req.login(user, function(err) {
                if(err) next(err);
                res.json(req.user);
            });
        }
    })(req, res, next);
});

app.post('/change-password', isLogged, 
    check('oldPassword').isString().notEmpty(),
    check('newPassword', 'La password deve essere lunga dai 8 ai 16 caratteri e deve contenere almeno un numero, una lettera maiuscola, una lettera minuscola e un carattere speciale.').isLength({max: 16, min: 8}).isStrongPassword(),
    check('confirmPassword').isString().notEmpty(),
    check('confirmPassword').custom((value, {req}) => {
        return value === req.body.newPassword ? Promise.resolve('Ok.') : Promise.reject('La password originale e quella di conferma devono combaciare.');
    }),
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});
        userDao.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword).then(result => {
            if(result?.error) return res.status(401).json({message: "Password errata."});
            else res.status(200).end();
        }).catch(err => {
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
);


//Function to check categories
function checkCategories(values, req) {
    if (!values || values.length < 1 || values.length > 3) {
        throw new Error('Selezionare da 1 a 3 categorie.');
    }

    const serverCategories = req.app.get('categories');
    
    // Validate first category is a main category
    const firstCategory = values[0];
    if (!isMainCategory(firstCategory, serverCategories)) {
        throw new Error('La prima categoria deve essere una categoria principale (Fotografia, Pittura o Disegno).');
    }

    // Convert and validate all categories
    const categoryIds = values.map((value, index) => {
        const isId = !isNaN(value);
        
        if (isId) {
            // If it's an ID, verify it exists
            const exists = Object.values(serverCategories)
                .some(cat => cat.id === parseInt(value));
            if (!exists) throw new Error(`La categoria con ID ${value} non esiste.`);
            
            // For categories after the first one, ensure they're not main
            if (index > 0 && isMainCategory(value, serverCategories)) {
                throw new Error('Le categorie secondarie non possono essere categorie principali.');
            }
            
            return parseInt(value);
        } else {
            // If it's a name, get its ID
            const category = serverCategories[value];
            if (!category) throw new Error(`La categoria "${value}" non esiste.`);
            
            // For categories after the first one, ensure they're not main
            if (index > 0 && isMainCategory(value, serverCategories)) {
                throw new Error('Le categorie secondarie non possono essere categorie principali.');
            }
            
            return category.id;
        }
    });

    // Check for duplicates
    if (new Set(categoryIds).size !== categoryIds.length) {
        throw new Error('Non puoi selezionare la stessa categoria più volte.');
    }

    req.categoryIds = categoryIds;
    return true;
}

//Function to check tags
function checkTags(values) {
    if(values.length <= 16) {
        for(const tag of values) {
                if(!typeof tag === 'string') return Promise.reject('Il tag deve essere una stringa.');
                if(!(tag.length >= 3 && tag.length <= 16) ) return Promise.reject('Il tag deve essere lungo 3-16 caratteri.');
                if(!tag.match(/^[a-zA-Z0-9_]+$/)) return Promise.reject('Il tag deve contenere solo lettere, numeri e underscore.');
        }
        return Promise.resolve('Ok.');
    }
    return Promise.reject('Superato il numero massimo di tag possibili (16).');
}

// Helper function to check if a category is main
function isMainCategory(category, serverCategories) {
    const mainCategoryNames = ['Pittura', 'Disegno', 'Fotografia'];
    
    if (isNaN(category)) {
        // If it's a name, check directly
        return mainCategoryNames.includes(category);
    } else {
        // If it's an ID, find the category and check its name
        const categoryObj = Object.entries(serverCategories)
            .find(([_, details]) => details.id === parseInt(category));
        return categoryObj && mainCategoryNames.includes(categoryObj[0]);
    }
}

app.post('/images/upload', storeImage, isLogged,
    [
        check('title', 'Il titolo deve essere lungo dai 5 ai 24 caratteri e può contenere solo lettere, numeri, underscore e spazi.').isString().trim().isLength({max: 24, min: 5}).matches(/[a-zA-Z0-9_\s]+/),
        check('description', 'La descrizione deve essere lunga al massimo 128 caratteri.').isString().trim().isLength({max: 128}),
        check('categories')
            .customSanitizer(values => {
                // Convert single value to array
                return typeof values === 'string' ? [values] : values;
            })
            .custom((values, { req }) => {
                return checkCategories(values, req);
            }),
        check('tags').customSanitizer(function(values) {
            if(typeof values === 'string') return [values];
            return [...new Set(values)];
        }).custom(function(values) {
            return checkTags(values);
        }),
    ], 
    (req, res) => {
        if(!req.file) return res.status(422).json({message: 'Nessun file caricato.'});
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            fs.unlinkSync(tempStorePath + req.body.originalfilename);
            return res.status(422).json({errors: errors.array()});
        }

        const data = {
            "title" : req.body.title,
            "description" : req.body.description,
            "path" : imageStorePath.replace(':id', req.user.id),
            "author" : req.user.id,
            "tags" : req.body.tags.map(el => el.toLowerCase()),
            "categories" : req.categoryIds, // Use the validated category IDs
            "extention" : path.extname(req.body.originalfilename)
        };
        
        imageDao.uploadImage(data).then(id => {
            fs.renameSync(tempStorePath + req.body.originalfilename, data.path + id + data.extention);
            return res.status(201).json({id});
        }).catch(err => {
            fs.unlinkSync(tempStorePath + req.body.originalfilename);
            if(err.errno === 19 && err.code === 'SQLITE_CONSTRAINT' && err.message.match(/UNIQUE constraint failed/)) {
                return res.status(409).json({message: 'Titolo già in uso.'});
            }
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
);

app.put('/images/:id', isLogged, 
    [
        check('title', 'Il titolo deve essere lungo dai 5 ai 24 caratteri e può contenere solo lettere, numeri, underscore e spazi.').isString().trim().isLength({max: 24, min: 5}).matches(/[a-zA-Z0-9_\s]+/),
        check('description', 'La descrizione deve essere lunga al massimo 128 caratteri.').isString().trim().isLength({max: 128}),
        check('categories')
            .customSanitizer(values => {
                // Convert single value to array
                return typeof values === 'string' ? [values] : values;
            })
            .custom((values, { req }) => {
                return checkCategories(values, req);
            }),
        check('tags').customSanitizer(function(values) {
            if(typeof values === 'string') return [values];
            return [...new Set(values)];
        }).custom(function(values) {
            return checkTags(values);
        }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});

        imageDao.getImageById(req.params.id).then(image => {
            if(!image) return res.status(404).json({error: 'Image not found'});
            if(image.AuthorId !== req.user.id && req.user.type !== 1) return res.status(403).json({error: 'Forbidden'});
            const data = {
                "title" : req.body.title,
                "description" : req.body.description,
                "categories" : req.categoryIds,
                "tags" : req.body.tags.map(el => el.toLowerCase())
            };
            imageDao.editImage(req.params.id, data).then(_done => res.status(200).end()).catch(err => {
                return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
            });
        }).catch(err => {
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
);

app.delete('/images/:id', isLogged, (req, res) => {
    imageDao.getImageById(req.params.id).then(image => {
        if(image.AuthorId !== req.user.id && req.user.type !== 1) return res.status(403).json({error: 'Forbidden'});
        fs.unlinkSync(image.ImagePath);
        imageDao.deleteImageById(req.params.id).then(_done => {
            return res.status(200).end();
        }).catch(err => {
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.get('/images/search', (req, res) => {
    let options = {};
    if(!req.query.value) {
        imageDao.getRandomImages().then(result => res.status(200).json(result)).catch(err => {
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    } else {
        switch(req.query.param) {
            case 'all': options['all'] = req.query.value; break; 
            case 'title': options['title'] = req.query.value; break;
            case 'author': options['author'] = req.query.value; break;
            case 'category': options['category'] = req.query.value; break;
            case 'tag': options['tag'] = req.query.value; break;
            default: return res.status(422).json({error: 'Parametro di ricerca non valido.'});
        }
        if(req.query.order) {
            switch(req.query.order) {
                case 'date': options['order'] = 'UploadDate'; break;
                case 'likes': options['order'] = 'Likes'; break;
                case 'comments': options['order'] = 'Comments'; break;
                default: return res.status(422).json({error: 'Parametro di ordine non valido.'});
            }
        }
        if(req.query.limit) {
            if(isNaN(req.query.limit)) return res.status(422).json({error: 'Limite non valido.'});
            options['limit'] = req.query.limit;
        }
        imageDao.getImages(options).then(result => res.status(200).json(result)).catch(err => {
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
});

app.get('/images/tags', (_req, res) => {
    imageDao.getMostUsedTags().then(result => res.status(200).json(result)).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
})

app.get('/images/:id', (req, res) => {
    imageDao.getImageById(req.params.id).then(result => {
        if(result) {
            result['editable'] = req.isAuthenticated() && (req.user.id === result.AuthorId || req.user.type === 1);
            res.status(200).json(result);
        }
        else res.status(404).json({error: 'Image not found'});
    }).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.get('/images/:id/tags', (req, res) => { 
    imageDao.getTagsByImageId(req.params.id).then(result => {
        if(result.length === 0) return res.status(404).json({error: 'Tags not found'});
        else return res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.get('/images/:id/categories', (req, res) => {
    imageDao.getCategoriesByImageId(req.params.id).then(result => {
        if(result.length === 0) return res.status(404).json({error: 'Categories not found'});
        else return res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.get('/images/:id/comments', (req, res) => {
    commentDao.getCommentsByImageId(req.params.id).then(result => {
        if(result.length === 0) return res.status(404).json({error: 'Comments not found'});
        else {
            result.forEach(el => el['editable'] = req.isAuthenticated() && (req.user.id === el.UserId || req.user.type === 1));
            return res.status(200).json(result);
        }
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.post('/images/:id/like', isLogged, (req, res) => {
    imageDao.likeImage(req.user.id, req.params.id).then(_done => res.status(201).end()).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.delete('/images/:id/unlike', isLogged, (req, res) => {
    imageDao.unlikeImage(req.user.id, req.params.id).then(_done => res.status(201).end()).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.get('/images/:id/isliked', isLogged, (req, res) => {
    imageDao.isImageLiked(req.user.id, req.params.id).then(result => res.status(200).json({isLiked: result !== undefined})).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.post('/images/:id/comments', isLogged, check('content', 'Il testo del commento deve essere lungo al massimo 128 caratteri.').isLength({max: 128, min: 1}), 
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});
        commentDao.addComment(req.user.id, req.params.id, req.body.content).then(result => res.status(201).json({id: result})).catch(err => {
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
);

app.put('/images/:id/comments/:commentId', isLogged, check('content', 'Il testo del commento deve essere lungo al massimo 128 caratteri.').isString().isLength({max: 128, min: 1}), 
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});
        commentDao.getCommentAuthor(req.params.commentId).then(author => {
            if(author === req.user.id || req.user.type === 1) { //se l'utente è l'autore del commento o è admin 
                commentDao.editComment(req.params.commentId, req.body.content).then(_done => res.status(200).end()).catch(err => {
                    return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
                });
            }
            else return res.status(403).json({error: 'Forbidden'});
        }).catch(err => {
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
);

app.delete('/images/:id/comments/:commentId', isLogged, (req, res) => {
    commentDao.getCommentAuthor(req.params.commentId).then(author => {
        if(author === req.user.id || req.user.type === 1) { //se l'utente è l'autore del commento o è admin 
            commentDao.deleteComment(req.params.commentId).then(_done => res.status(201).end()).catch(err => {
                return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
            });
        }
        else return res.status(403).json({error: 'Forbidden'});
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.post('/images/:id/comments/:commentId/like', isLogged, (req, res) => {
    commentDao.likeComment(req.user.id, req.params.commentId).then(_done => res.status(201).end()).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.delete('/images/:id/comments/:commentId/unlike', isLogged, (req, res) => {
    commentDao.unlikeComment(req.user.id, req.params.commentId).then(_done => res.status(201).end()).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.get('/images/:id/comments/:commentId/isliked', isLogged, (req, res) => {
    commentDao.isCommentLiked(req.user.id, req.params.commentId).then(result => res.status(200).json({isLiked: result !== undefined})).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});


app.get('/users/me', (req, res) => {
    if(!req.isAuthenticated()) return res.status(404).json({error: 'User not found'});
    userDao.getUserInfoById(req.user.id).then(user => {
        return res.status(200).json(user);
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.get('/users/:id', (req, res) => {
    userDao.getUserInfoById(req.params.id).then(user => {
        if(!user) return res.status(404).json({error: 'User not found'});
        return res.status(200).json(user);
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.delete('/logout', (req, res, next) => {
    req.logOut(function(err) { 
        if(err) next(err);
        return res.status(200).end();
    });
});

//serve the index.html file for all routes (client side routing)
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// activate server
app.listen (port, () =>  console.log(`Server ready running at port ${port}` )) ;
