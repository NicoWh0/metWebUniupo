'use strict';
// import package
const express = require('express') ;
const morgan = require('morgan');
const moment = require('moment');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
//const fileUpload = require('express-fileupload');
const multer = require('multer');
//const bodyParser = require('bodyparser');


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
const userImageStorePath = storePath + 'profile/';
/*
const imageStorage1 = multer.diskStorage(
    {
        destination: function(req, _file, cb) {
            console.log('Impostando la destinazione');
            console.log(req.body);
            cb(null, req.body.imagePath);
        },
        filename: function(req, file, cb) {
            console.log('Impostando il nome');
            console.log(req.body);
            cb(null, req.body.imageId + path.extname(file.originalname));
        }
    }
)*/

const imageStorage = multer.diskStorage(
    {
        destination: function(req, _file, cb) {
            console.log('Impostando la destinazione');
            console.log(req.body);
            cb(null, tempStorePath);
        },
        filename: function(req, file, cb) {
            console.log('Impostando il nome');
            console.log(req.body);
            req.body['originalfilename'] = file.originalname;
            cb(null, file.originalname);
        }
    }
)
/*
const storeImage1 = multer({
    storage: imageStorage1,
    limits: {
        fieldSize: 8 * 1024 * 1024 //8 MB
    },
    fileFilter: function(req, file, cb) {
        console.log('Sto filtrando...');
        console.log(req.body);
        const extention = path.extname(file.originalname);
        if(extention === '.jpg' || extention === '.jpeg' || extention === '.png')
            cb(null, true);
        cb(null, false);
    }
}).single('imageFile');*/


const storeImage = multer({
    storage: imageStorage,
    limits: {
        field: 8 * 1024 * 1024 //8 MB
    },
    fileFilter: function(req, file, cb) {
        console.log('Prova multer');
        console.log(req.body);
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


//REST API

app.get('/imageFile/:userId/:type/:filename', (req, res) => {
    const { userId, type, filename } = req.params;
    
    // Build the file path
    const filePath = path.join(
        __dirname,
        'db_images',
        userId,
        type, // 'published' or 'profile'
        filename
    );

    // Send the file or a default image if not found
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            // Send a default image or 404
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

app.get('/etiquette', (_req, res) => {
    res.status(200).json({etiquette: 'Comportati bene!'});
});

app.get('/categories', (req, res) => {
    return res.status(200).json({categories: req.app.get('categories')});
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        userDao.loginUser(username, password).then(({user, pass}) => {
            console.log(`user: ${user}, pass: ${pass}`);
            if(!user) done(null, false, {message: 'Incorrect Username'});
            else if(!pass) done(null, false, {message: 'Incorrect Password'});
            else done(null, user);
        }).catch(err => done(err));
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    userDao.getUserInfoById(id).then(user => {
        console.log('Deserializzato');
        console.log(user);
        done(null, user);
    }).catch(err => done(err));
});


app.use(session({
    secret: 'The secret sentence of this session. Must not share with anyone.',
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());


const isLogged = function(req, res, next) {
    if(req.isAuthenticated()) next();
    else res.status(401).json({error: 'Not Authenticated'});
}

const isLoggedAdmin = function(req, res, next) {
    if(req.isAuthenticated() && req.user.type === 1) next();
    else res.status(401).json({error: 'Not Authenticated as Admin'});
}


//test per verificare sessione/login/logout/protezione etc. (poi da commentare o eliminare)
app.get('/protected', (req, res, next) => {
    if(req.isAuthenticated()) next();
    else res.status(401).send('Non sei loggato. Pussa via.\n');
}, (_req, res) => {
    res.status(200).send('Ok. Sei loggato.\n');
});

app.post('/registration', 
    [
        check(['username', 'email', 'password', 'confirmpassword'], 'The parameters must be strings').isString(),
        check('username', 'The username must be 4-20 characters long').trim().isLength({max: 20, min: 4}),
        check('password', 'The password must be 8-16 characters long and must contain 1 uppercase letter, 1 number and 1 special character').isLength({max: 16, min: 8}).isStrongPassword(),
        check('email', 'A valid mail is needed').trim().isEmail(),
        check('confirmPassword').custom((value, {req}) => {
            return value === req.body.password ? Promise.resolve('Ok.') : Promise.reject('Password mismatch.');
        })
    ],
    (req, res) => {
        console.log(req.body);

        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});
        
        userDao.registerUser(req.body).then(id => {
            fs.mkdirSync(imageStorePath.replace(':id', id), {recursive: true});
            fs.mkdirSync(userImageStorePath.replace(':id', id), {recursive: true});
            return res.status(201).end();
        }).catch(err => {
            if(err.errno === 19 && err.code === 'SQLITE_CONSTRAINT' && err.message.match(/UNIQUE constraint failed/)) {
                return res.status(409).json({message: 'Username or Email already in use by another account.'});
            }
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
);


app.post('/login', check(['username', 'password']).notEmpty(), function(req, res, next) {
    console.log(req.body);
    
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
                console.log(req.user);
                console.log(req.session.passport.user);
                res.json(req.user);
            });
        }
    })(req, res, next);
});

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
        check('title').isLength({max: 24, min: 5}),
        check('description').isString().isLength({max: 128}),
        check('categories')
            .customSanitizer(values => {
                // Convert single value to array
                return typeof values === 'string' ? [values] : values;
            })
            .custom((values, { req }) => {
                // Check array length
                if (!values || values.length < 1 || values.length > 3) {
                    throw new Error('Devi selezionare da 1 a 3 categorie.');
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
            }),
        check('tags').customSanitizer(function(values) {
            if(typeof values === 'string') return [values];
            return [...new Set(values)];
        }).custom(function(values) {
            if(values.length <= 16) {
                for(const tag of values) {
                    if(!typeof tag === 'string') return Promise.reject('Tag is not a string.');
                    if( !(tag.length >= 3 && tag.length <= 16) ) return Promise.reject('Invalid tag length.');
                }
                return Promise.resolve('Ok.');
            }
            return Promise.reject('A maximum of 16 tags is required.');
        }),
    ], 
    (req, res) => {
        console.log(req.body);
        if(!req.file) return res.status(422).json({error: 'No file was uploaded'});
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
        
        console.log('I dati sono: ');
        console.log(data);
        imageDao.uploadImage(data).then(id => {
            fs.renameSync(tempStorePath + req.body.originalfilename, data.path + id + data.extention);
            return res.status(201).end();
        }).catch(err => {
            console.log('Errore nel database: ' + err);
            fs.unlinkSync(tempStorePath + req.body.originalfilename);
            if(err.errno === 19 && err.code === 'SQLITE_CONSTRAINT' && err.message.match(/UNIQUE constraint failed/)) {
                return res.status(409).json({message: 'Title already in use.'});
            }
            return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
        });
    }
);

app.post('/users/:id/avatar', storeImage, isLogged, (req, res) => {
    console.log(req.body);
    if(!req.file) return res.status(422).json({error: 'No file was uploaded'});
    if(req.user.id != req.params.id) return res.status(401).json({error: 'Not Authorized'});

    const avatarPath = userImageStorePath.replace(':id', req.user.id) + 'avatar' + path.extname(req.body.originalfilename);
    userDao.changeUserImage(req.params.id, avatarPath).then(_done => {
        for(const ext of ['.png', '.jpg', '.jpeg']) {
            if(fs.existsSync(userImageStorePath.replace(':id', req.user.id) + 'avatar' + ext))
                fs.unlinkSync(userImageStorePath.replace(':id', req.user.id) + 'avatar' + ext);
        }
        fs.renameSync(tempStorePath + req.body.originalfilename, avatarPath);
        return res.status(201).end();
    }).catch(err => {
        console.log('Errore nel database: ' + err);
        fs.unlinkSync(tempStorePath + req.body.originalfilename);
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.post('/users/:id/cover', storeImage, isLogged, (req, res) => {
    console.log(req.body);
    if(!req.file) return res.status(422).json({error: 'No file was uploaded'});
    if(req.user.id != req.params.id) return res.status(401).json({error: 'Not Authorized'});

    const coverPath = userImageStorePath.replace(':id', req.user.id) + 'cover' + path.extname(req.body.originalfilename);
    userDao.changeUserCover(req.params.id, coverPath).then(_done => {
        for(const ext of ['.png', '.jpg', '.jpeg']) {
            if(fs.existsSync(userImageStorePath.replace(':id', req.user.id) + 'cover' + ext))
                fs.unlinkSync(userImageStorePath.replace(':id', req.user.id) + 'cover' + ext);
        }
        fs.renameSync(tempStorePath + req.body.originalfilename, coverPath);
        return res.status(201).end();
    }).catch(err => {
        console.log('Errore nel database: ' + err);
        fs.unlinkSync(tempStorePath + req.body.originalfilename);
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});


app.get('/images/search', (req, res) => {
    console.log(req.query);
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
            default: return res.status(422).json({error: 'Invalid search parameter.'});
        }
        if(req.query.order) {
            switch(req.query.order) {
                case 'date': options['order'] = 'UploadDate'; break;
                case 'likes': options['order'] = 'Likes'; break;
                case 'comments': options['order'] = 'Comments'; break;
                default: return res.status(422).json({error: 'Invalid order parameter.'});
            }
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
            result['editable'] = req.isAuthenticated() && (req.user.id === result.author || req.user.type === 1);
            res.status(200).json(result);
        }
        else res.status(404).json({error: 'Image not found'});
    }).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.get('/images/:id/tags', (req, res) => { 
    imageDao.getTagsByImageId(req.params.id).then(result => res.status(200).json(result)).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.get('/images/:id/categories', (req, res) => {
    imageDao.getCategoriesByImageId(req.params.id).then(result => res.status(200).json(result)).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.get('/images/:id/comments', (req, res) => {
    commentDao.getCommentsByImageId(req.params.id).then(result => {
        result.forEach(el => el['editable'] = req.isAuthenticated() && (req.user.id === el.author || req.user.type === 1));
        return res.status(200).json(result);
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.post('/images/:id/like', isLogged, (req, res) => {
    imageDao.likeImage(req.user.id, req.params.id).then(_done => res.status(201).end()).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.post('/images/:id/unlike', isLogged, (req, res) => {
    imageDao.unlikeImage(req.user.id, req.params.id).then(_done => res.status(201).end()).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.get('/images/:id/isliked', isLogged, (req, res) => {
    imageDao.isImageLiked(req.user.id, req.params.id).then(result => res.status(200).json(result)).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    );
});

app.get('/images/:id/likes', (req, res) => {
    imageDao.getLikesByImageId(req.params.id).then(result => res.status(200).json(result)).catch(err => 
        res.status(500).json({errors: {'Param' : 'Server', 'message' : err}})
    ); 
});

app.post('/images/:id/comments', isLogged, check('text').isLength({max: 256, min: 1}), (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});
    commentDao.addComment(req.user.id, req.params.id, req.body.text).then(_done => res.status(201).end()).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.put('/images/:id/comments/:commentId', isLogged, check('text').notEmpty(), (req, res) => {
    commentDao.getCommentAuthor(req.params.commentId).then(author => {
        //console.log("Author: " + author);
        //console.log("User: " + req.user.id);
        if(author === req.user.id || req.user.type === 1) { //se l'utente è l'autore del commento o è admin
            const errors = validationResult(req);
            if(!errors.isEmpty()) return res.status(422).json({errors: errors.array()});
            commentDao.editComment(req.params.commentId, req.body.text).then(_done => res.status(201).end()).catch(err => {
                return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
            });
        }
        else return res.status(401).json({error: 'Not Authorized'});
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.post('/images/:id/comments/:commentId/like', isLogged, (req, res) => {
    commentDao.likeComment(req.user.id, req.params.commentId).then(_done => res.status(201).end()).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.post('/images/:id/comments/:commentId/unlike', isLogged, (req, res) => {
    commentDao.unlikeComment(req.user.id, req.params.commentId).then(_done => res.status(201).end()).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.get('/images/:id/comments/:commentId/isliked', isLogged, (req, res) => {
    commentDao.isCommentLiked(req.user.id, req.params.commentId).then(result => res.status(200).json(result)).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.get('/users/me', (req, res) => {
    if(!req.isAuthenticated()) return res.status(404).json({error: 'User not found'});
    userDao.getUserInfoById(req.user.id).then(user => {
        res.status(200).json(user);
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});

app.delete('/users/:id', isLogged, (req, res, next) => {
    if(req.user.id != req.params.id) return res.status(401).json({error: 'Not Authorized'});
    userDao.deleteUser(req.params.id).then(id => {
        fs.rmSync(storePath.replace(':id', id), {recursive: true});
        req.logOut(function(err) {
            if(err) next(err);
            res.status(200).json({message: 'User deleted.'});
        });
    }).catch(err => {
        return res.status(500).json({errors: {'Param' : 'Server', 'message' : err}});
    });
});


app.delete('/logout', (req, res, next) => {
    req.logOut(function(err) { 
        if(err) next(err);
        res.redirect('/home');
    });
});

/*
app.use((err, req, res, next) => {
    console.log(req.body);
    if(req.body['imageId']) {
        imageDao.deleteImageById(req.body['imageId']).then(_done => next(err)).catch(dbErr => {
            return res.status(500).json({errors: {'Param' : 'Server', 'messages' : [err, dbErr]}});
        });
    }
    else next(err);
})*/

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// activate server
app.listen (port, () =>  console.log(`Server ready running at port ${port}` )) ;
