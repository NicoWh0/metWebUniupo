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
app.use(express.static('db_images'));
app.get('/', (_req, res) => res.redirect('/home'));

//Enum for the categories
let categories = {};
imageDao.getAllCategories().then(result => categories = result).catch(err => {throw err});


//REST API

app.get('/home', (_req, res) => {
    console.log(categories);
    res.status(200).end();
});

app.get('/etiquette', (_req, res) => {
    res.status(200).json({etiquette: 'Comportati bene!'});
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
        check('confirmpassword').custom((value, {req}) => {
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
                return res.status(409).json({error: 'Username or Email already in use by another account.'});
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

app.post('/images/upload', storeImage, isLogged,
    [
        check('title').isLength({max: 24, min: 6}),
        check('description').isString().isLength({max: 128}), //can be empty
        check('categories').customSanitizer(function(values) {
            return typeof values === 'string' ? [values] : values;
        }).custom(function(values) {
            //console.log(`Categories = ${values}... length = ${values.length}`);
            //for(const el of values) console.log('Valore ' + el);
            if(values.length <= 3 && values.length > 0) {
                for(const id of values) {
                    if( !(id in categories) ) return Promise.reject('Invalid category name.');
                }
                return Promise.resolve('Ok.');
            }
            return Promise.reject('A number of 1-3 categories is required.');
        }),
        check('tags').customSanitizer(function(values) {
            if(typeof values === 'string') return [values];
            return [...new Set(values)];
        }).custom(function(values) {
            //console.log(`Tags = ${values}`);
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
            "categories" : (array => array.map(el => categories[el]))(req.body.categories),
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

app.get('/search', (req, res) => {
    console.log(req.query);
    let options = {};
    if(!req.query.value) return res.status(422).json({error: 'Search value is not present.'});
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

// activate server
app.listen (port, () =>  console.log(`Server ready running at port ${port}` )) ;
