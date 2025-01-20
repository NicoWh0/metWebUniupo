'use strict';

const db = require('./db');


class CommentDao {

    addComment(userId, imageId, content) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Comment(UserId, ImageId, Content, UploadDate) VALUES(?, ?, ?, DATETIME('now', 'localtime'))";
            db.run(sql, [userId, imageId, content], function(err) {
                if(err) reject(err);
                else resolve();
            });
        })
    }

    getCommentAuthor(commentId) { 
        return new Promise((resolve, reject) => {
            const sql = "SELECT UserId FROM Comment WHERE Id = ?";
            db.get(sql, [commentId], function(err, row) {
                if(err) reject(err);
                else resolve(row.UserId);
            });
        });
    }

    getCommentsByImageId(imageId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT Comment.Id, Comment.Content, Comment.UploadDate, User.Username FROM Comment JOIN User ON Comment.UserId = User.Id WHERE Comment.ImageId = ?";
            db.all(sql, [imageId], function(err, rows) {
                if(err) reject(err);
                else resolve(rows);
            });
        })
    }

    editComment(commentId, content) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE Comment SET Content = ? WHERE Id = ?";
            db.run(sql, [content, commentId], function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    };

    likeComment(userId, commentId) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO CommentLike(UserId, CommentId) VALUES(?, ?)";
            db.run(sql, [userId, commentId], function(err) {
                if(err) reject(err);
                else resolve();
            });
        })
    }

    unlikeComment(userId, commentId) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM CommentLike WHERE UserId = ? AND CommentId = ?";
            db.run(sql, [userId, commentId], function(err) {
                if(err) reject(err);
                else resolve();
            });
        })
    }

    isCommentLiked(userId, commentId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM CommentLike WHERE UserId = ? AND CommentId = ?";
            db.get(sql, [userId, commentId], function(err, row) {
                if(err) reject(err);
                else resolve(row);
            });
        })
    }

    getLikes(commentId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(commentId) FROM CommentLike WHERE CommentId = ?";
            db.all(sql, [commentId], function(err, rows) {
                if(err) reject(err);
                else resolve(rows);
            });
        })
    }

}

module.exports = CommentDao;