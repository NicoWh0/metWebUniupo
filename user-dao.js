'use strict';

const db = require('./db');
const bcrypt = require('bcrypt');
const moment = require('moment');


class UserDao {

    registerUser(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO User (Username, Email, HashPassword, DateTimeSignedUp) VALUES (?, ?, ?, DATETIME(\'now\', \'localtime\'))';  //il resto sono i valori di default del database
            bcrypt.hash(data.password, 10).then(hash => {
                db.run(sql,
                    [
                        data.username,
                        data.email,
                        hash
                    ], function(err) {
                        if(err) reject(err);
                        else resolve(this.lastID);
                    }
                )
            }).catch(err => reject(err));
        })
    }

    loginUser(username, password) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT Id, Username, UserImage, HashPassword, Type FROM User WHERE Username = ?';
            db.get(sql, [username], function(err, row) {
                if(err) reject(err);
                else if(!row) resolve({user: false, pass: undefined});
                else {
                    resolve(
                       { 
                         user: {id: row.Id},
                         pass: bcrypt.compareSync(password, row.HashPassword)
                       },
                    );
                }
            })
        })
    }

    #checkIfNotExist(sql, param) {
        return new Promise((resolve, reject) => {
            db.run(sql, [param], function(err, row) {
                if(err) reject(err);
                else if(!row) resolve({success: true});
                else resolve({success: false});
            })
        })
    }

    checkIfUsernameNotExist(username) {
        return this.#checkIfNotExist('SELECT Id FROM User WHERE Username = ?', username);
    }

    checkIfEmailNotExist(email) {
        return this.#checkIfNotExist('SELECT Id FROM User WHERE Email = ?', email);
    }

    getUserInfoById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT Username, UserImage, Type FROM User WHERE Id = ?';  
            db.get(sql, [id], function(err, row) {
                if(err) reject(err);
                else if(!row) resolve({error: 'User not found.'});
                else resolve({id: id, username: row.Username, userimage: row.UserImage, type: row.Type});
            })
        });
    }

    setEmailVisibility(id, visibility) {
        return new Promise((resolve, reject) => {
            if(visibility === true) visibility = 1;
            else if(visibility === false) visibility = 0;
            else if(visibility != 0 || visibility != 1) reject('Invalid visibility value.');
            const sql = 'UPDATE User SET ShowEmail = ? WHERE Id = ?';
            db.run(sql, [visibility, id], function(err) {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    changePassword(id, oldPassword, newPassword) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT HashPassword FROM User WHERE Id = ?';
            db.get(sql, [id], function(err, row) {
                if(err) reject(err);
                else if(!row) resolve({error: 'User not found.'});
                else {
                    bcrypt.compare(oldPassword, row.HashPassword).then(result => {
                        if(result) {
                            bcrypt.hash(newPassword, 10).then(hash => {
                                const sql = 'UPDATE User SET HashPassword = ? WHERE Id = ?';
                                db.run(sql, [hash, id], function(err) {
                                    if(err) reject(err);
                                    else resolve();
                                })
                            }).catch(err => reject(err));
                        }
                        else resolve({error: 'Wrong password.'});
                    }).catch(err => reject(err));
                }
            })
        })
    }

    changeUsername(id, newUsername) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE User SET Username = ? WHERE Id = ?';
            db.run(sql, [newUsername, id], function(err) {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    changeUserImage(id, userImage) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE User SET UserImage = ? WHERE Id = ?';
            db.run(sql, [userImage, id], function(err) {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    changeUserType(id, type) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE User SET Type = ? WHERE Id = ?';
            db.run(sql, [type, id], function(err) {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    changeUserCover(id, cover) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE User SET UserCover = ? WHERE Id = ?';
            db.run(sql, [cover, id], function(err) {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    changeUserDescription(id, description) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE User SET Description = ? WHERE Id = ?';
            db.run(sql, [description, id], function(err) {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    deleteUser(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM User WHERE Id = ?';
            db.run(sql, [id], function(err) {
                if(err) reject(err);
                else resolve(id);
            })
        })
    }

}

module.exports = UserDao;
