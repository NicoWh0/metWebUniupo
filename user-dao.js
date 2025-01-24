'use strict';

const db = require('./db');
const bcrypt = require('bcrypt');


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
            const sql = 'SELECT Id, Username, HashPassword, Type FROM User WHERE Username = ?';
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

    getUserInfoById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT Username, Type, Email, DateTimeSignedUp AS SignedUp FROM User WHERE Id = ?';  
            db.get(sql, [id], function(err, row) {
                if(err) reject(err);
                else if(!row) resolve();
                else resolve({id: id, username: row.Username, type: row.Type, email: row.Email, signedUp: row.SignedUp});
            })
        });
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
}

module.exports = UserDao;
