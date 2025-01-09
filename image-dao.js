'use strict';

const db = require('./db');


class ImageDao {

    #generatePlaceHolder(array, id = undefined) {
        let placeHolders = [];
        array.forEach(() => placeHolders.push(`(${id ? id +',':''} ?)`));
        console.log('Placeholders creati: ');
        console.log(placeHolders);
        return placeHolders.join(',');
    }

    getAllCategories() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Category';
            db.all(sql, function(err, rows) {
                if(err) reject(err);
                else {
                    let categories = {};    //Building the enum for the server
                    rows.forEach(row => {
                        categories[row.Name] = {
                            id: row.Id,
                            iconPath: row.IconImage
                        }
                    });
                    console.log("Categories: ", categories);
                    resolve(categories);
                }
            })
        })
    }

    getMostUsedTags() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT TagName, COUNT(*) AS Uses FROM ImageTag GROUP BY TagName ORDER BY Uses DESC LIMIT 20';
            db.all(sql, function(err, rows) {
                if(err) reject(err);
                else resolve(rows);
            });
        });
    }

    getRandomImages() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT i.Title, i.Description, i.UploadDate, i.ImagePath, i.Author AS AuthorId, u.Username AS AuthorName, u.UserImage AS AuthorImage
            FROM Image i JOIN User u ON u.Id = i.Author ORDER BY RANDOM() LIMIT 50`;
            db.all(sql, function(err, rows) {
                if(err) reject(err);
                else resolve(rows);
            });
        });
    }

    uploadImage(data) {
        return new Promise((resolve, reject) => {    //data = {title, description, path, author, categories, tags, extention}
            db.serialize(() => {
                console.log('Inizio transazione immagine...');
                db.run(
                    "INSERT INTO Image(Title, Description, UploadDate, ImagePath, Author) VALUES(?, ?, DATETIME('now', 'localtime'), ?, ?)", [data.title, data.description, data.path, data.author], 
                    function(err) { if(err) reject(err) }
                );
                console.log('Immagine inserita.');
                db.run(
                    'UPDATE Image SET ImagePath = (SELECT ImagePath || Id || ? FROM Image WHERE Id = (SELECT * FROM last_image_id)) WHERE Id = (SELECT * FROM last_image_id)', data.extention,
                    function(err) { if(err) reject(err) }
                );
                console.log('Path aggiornato.');
                db.run(
                    'INSERT INTO ImageCategory(ImageId, CategoryId) VALUES' + this.#generatePlaceHolder(data.categories, '(SELECT * FROM last_image_id)'), data.categories,
                    function(err) { if(err) reject(err) }
                );
                console.log('Categorie inserite.');
                if(data.tags && data.tags.length > 0) db.run(
                    'INSERT INTO ImageTag(ImageId, TagName) VALUES' + this.#generatePlaceHolder(data.tags, '(SELECT * FROM last_image_id)'), data.tags,
                    function(err) { if(err) reject(err) }
                );
                console.log('Tag inseriti, se presenti.');
                db.get(
                    'SELECT * FROM last_image_id', function(err, row) {
                        if(err) reject(err);
                        else resolve(row.seq);
                    }
                );
            });

        });
    }

    getImageById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT i.Title, i.Description, i.UploadDate, i.ImagePath, i.Author AS AuthorId, u.Username AS AuthorName, u.UserImage AS AuthorImage, cnt1.Likes, cnt2.Comments 
            FROM Image i JOIN User u ON u.Id = i.Author JOIN ( SELECT i.Id, COUNT(il.ImageId) AS Likes FROM Image i LEFT JOIN ImageLike il ON i.Id = il.ImageId GROUP BY i.Id ) cnt1 ON cnt1.Id = i.Id 
            JOIN ( SELECT i.Id, COUNT(c.ImageId) AS Comments FROM Image i LEFT JOIN Comment c ON i.Id = c.ImageId GROUP BY i.Id ) cnt2 ON cnt2.Id = i.Id WHERE i.Id = ?`;
            db.get(sql, [id], function(err, row) {
                if(err) reject(err);
                else resolve(row);
            });
        });
    }

    getCategoriesByImageId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT c.Name FROM Category c JOIN ImageCategory ic ON c.Id = ic.CategoryId WHERE ic.ImageId = ?';
            db.all(sql, [id], function(err, rows) {
                if(err) reject(err);
                else resolve(rows);
            });
        });
    }

    getTagsByImageId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT TagName FROM ImageTag WHERE ImageId = ?';
            db.all(sql, [id], function(err, rows) {
                if(err) reject(err);
                else resolve(rows);
            });
        });
    }

    deleteImageById(id) {
        return new Promise((resolve, reject) => {
            console.log('Cancello immagine...');
            console.log(id);
            const sql = 'DELETE FROM Image WHERE Id = ?'
            db.run(sql, [id], function(err) {
                if(err) reject(err);
                else if(!this.changes) resolve({err: 'No Image Found.'});
                else resolve();
            });
        });
    }

    likeImage(userId, imageId) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ImageLike(UserId, ImageId) VALUES(?, ?)';
            db.run(sql, [userId, imageId], function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    unlikeImage(userId, imageId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ImageLike WHERE UserId = ? AND ImageId = ?';
            db.run(sql, [userId, imageId], function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    isImageLiked(userId, imageId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ImageLike WHERE UserId = ? AND ImageId = ?';
            db.get(sql, [userId, imageId], function(err, row) {
                if(err) reject(err);
                else resolve(row);
            });
        });
    }

    getLikes(imageId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS Likes FROM ImageLike WHERE ImageId = ?';
            db.get(sql, [imageId], function(err, row) {
                if(err) reject(err);
                else resolve(row.Likes);
            });
        });
    }

    editImage(imageId, data) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE Image SET Title = ?, Description = ? WHERE Id = ?';
            db.run(sql, [data.title, data.description, imageId], function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    addCategoryToImage(imageId, categoryId) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ImageCategory(ImageId, CategoryId) VALUES(?, ?)';
            db.run(sql, [imageId, categoryId], function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    removeCategoryFromImage(imageId, categoryId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ImageCategory WHERE ImageId = ? AND CategoryId = ?';
            db.run(sql, [imageId, categoryId], function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    addTagToImage(imageId, tag) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO ImageTag(ImageId, TagName) VALUES(?, ?)';
            db.run(sql, [imageId, tag], function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    removeTagFromImage(imageId, tag) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ImageTag WHERE ImageId = ? AND TagName = ?';
            db.run(sql, [imageId, tag], function(err) {
                if(err) reject(err);
                else resolve();
            });
        });
    }

    getImages(options) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT DISTINCT i.Title, i.Description, i.UploadDate, i.ImagePath, i.Author AS AuthorId, u.Username AS AuthorName, u.UserImage AS AuthorImage, cnt1.Likes, cnt2.Comments 
            FROM Image i JOIN User u ON u.Id = i.Author JOIN ImageCategory ic ON i.Id = ic.ImageId JOIN Category c ON ic.CategoryId = c.Id JOIN ImageTag it ON it.ImageId = i.Id
            JOIN ( SELECT i.Id, COUNT(il.ImageId) AS Likes FROM Image i LEFT JOIN ImageLike il ON i.Id = il.ImageId GROUP BY i.Id ) cnt1 ON cnt1.Id = i.Id 
            JOIN ( SELECT i.Id, COUNT(c.ImageId) AS Comments FROM Image i LEFT JOIN Comment c ON i.Id = c.ImageId GROUP BY i.Id ) cnt2 ON cnt2.Id = i.Id`;
            let input = [];
            const validOrderColumns = ['UploadDate', 'Likes', 'Comments'];
            if(options.all) {
                sql += ` WHERE i.Title LIKE ('%' || ? || '%') OR c.Name LIKE ('%' || ? || '%') OR it.TagName LIKE ('%' || ? || '%') OR AuthorName LIKE ('%' || ? || '%')`;
                input = [options.all, options.all, options.all, options.all];
            }
            else {
                if(options.title) {
                    sql += ` WHERE i.Title LIKE ('%' || ? || '%')`;
                    input = [options.title];
                }
                else if(options.category) {
                    sql += ` WHERE c.Name LIKE ('%' || ? || '%')`;
                    input = [options.category];
                }
                else if(options.author) {
                    sql += ` WHERE u.Username LIKE ('%' || ? || '%')`;
                    input = [options.author];
                }
                else if(options.tag) {
                    sql += ` WHERE it.TagName LIKE ('%' || ? || '%')`;
                    input = [options.tag];
                }
            }
            if(options.order) {
                if(validOrderColumns.includes(options.order))
                    sql += ` ORDER BY ${options.order} DESC`;
                else reject({err: 'Invalid order parameter.'});
            }
            else sql += ` ORDER BY Likes + Comments DESC`;
            
            sql += ` LIMIT 100`;
            console.log(sql);

            db.all(sql, input, function(err, rows) {
                if(err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = ImageDao;