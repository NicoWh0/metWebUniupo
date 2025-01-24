"use strict";

class API {

    
    static headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    static multipartHeaders = {
        //'Content-Type': 'multipart/form-data', (il browser lo setta da solo)
        'Accept': 'application/json'
    }

    // Auth endpoints
    static async getCurrentUser() {
        try {
            const response = await fetch('/users/me', { headers: this.headers });
            if (response.status === 404) return null;
            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Error fetching current user:', error);
            throw error;
        }
    }

    // Categories endpoints
    static async getCategories() {
        try {
            const response = await fetch('/categories', { headers: this.headers });
            const data = await response.json();
            return Object.entries(data.categories).map(([name, details]) => ({
                name,
                id: details.id,
                iconPath: details.iconPath
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    // Tags endopoints
    static async getMostUsedTags() {
        try {
            const response = await fetch('/images/tags', { headers: this.headers });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching most used tags:', error);
            return [];
        }
    }

    static async getImageFile(imagePath) {
        const fetchPath = imagePath.replace('db_images', '/imageFile');

        try {
            const image = await fetch(fetchPath, {headers: this.headers});
            console.log(image);
            return image;
        } catch(error) {
            console.error('Error fetching image file: ', error);
            throw error;
        }
    }

    // Images endpoints
    static async getRandomImages() {
        try {
            const response = await fetch('/images/search', { headers: this.headers });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching random images: ', error);
            return [];
        }
    }

    static async searchImages(value, param = '', order = '', limit = 100) {
        try {
            const response = await fetch(`/images/search?value=${value}&param=${param}&order=${order}&limit=${limit}`, { 
                headers: this.headers 
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching images:', error);
            return [];
        }
    }

    static async isImageLiked(imageId) {
        try {
            const response = await fetch(`/images/${imageId}/isliked`, { headers: this.headers });
            const data = await response.json();
            return data.isLiked;
        } catch (error) {
            console.error('Error checking if image is liked:', error);
            return false;
        }
    }

    static async likeImage(imageId) {
        try {
            const response = await fetch(`/images/${imageId}/like`, {
                method: 'POST',
                headers: this.headers
            });
            if(!response.ok) {
                if(response.status === 401) {
                    throw new Error('Utente non autenticato.', { cause: response.status });
                }
                else if(response.status === 404) {
                    throw new Error('Immagine non trovata.', { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }
            return response;
        } catch (error) {
            console.error('Error liking image:', error);
            throw error;
        }
    }

    static async unlikeImage(imageId) {
        try {
            const response = await fetch(`/images/${imageId}/unlike`, {
                method: 'DELETE',
                headers: this.headers
            });
            if(!response.ok) {
                if(response.status === 401) {
                    throw new Error('Utente non autenticato.', { cause: response.status });
                }
                else if(response.status === 404) {
                    throw new Error('Immagine non trovata.', { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }
            return response;
        } catch (error) {
            console.error('Error unliking image:', error);
            throw error;
        }
    }

    static async getImageById(id) {
        try {
            const response = await fetch(`/images/${id}`, { headers: this.headers });
            if(!response.ok) {
                if(response.status === 404) {
                    throw new Error('Immagine non trovata.', { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching image by id:', error);
            throw error;
        }
    }

    static async uploadImage(data) {
        try {
            const response = await fetch('/images/upload', {
                method: 'POST',
                headers: this.multipartHeaders,
                body: data
            });

            const translateFieldToItalian = (field) => {
                if(field === 'title') return 'Titolo';
                if(field === 'description') return 'Descrizione';
                if(field === 'categories') return 'Categorie';
                if(field === 'tags') return 'Tag';
                return field;
            }

            if (!response.ok) {
                if(response.status === 401) {
                    throw new Error('Utente non autenticato.', { cause: response.status });
                }
                else if(response.status === 422) {
                    const json = await response.json();
                    const errors = json.errors;
                    const message = 'I seguenti campi non sono validi: ' + errors.map(
                        error => translateFieldToItalian(error.path)
                    ).join(', ');
                    throw new Error(message, { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }
            const uploadedImage = await response.json();
            return uploadedImage.id;
        } catch (error) {
            console.error('Upload Image error: ', error);
            throw error;
        }
    }

    static async editImage(id, data) {
        try {
            const response = await fetch(`/images/${id}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            const translateFieldToItalian = (field) => {
                if(field === 'title') return 'Titolo';
                if(field === 'description') return 'Descrizione';
                if(field === 'categories') return 'Categorie';
                if(field === 'tags') return 'Tag';
                return field;
            }

            if(!response.ok) {
                if(response.status === 401) {
                    throw new Error('Utente non autenticato.', { cause: response.status });
                }
                else if(response.status === 403) {
                    throw new Error('Non hai i permessi per modificare questa immagine.', { cause: response.status });
                }
                else if(response.status === 404) {
                    throw new Error('Immagine non trovata.', { cause: response.status });
                }
                else if(response.status === 422) {
                    const json = await response.json();
                    const errors = json.errors;
                    const message = 'I seguenti campi non sono validi: ' + errors.map(
                        error => translateFieldToItalian(error.path)
                    ).join(', ');
                    throw new Error(message, { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }
            return response;
        } catch (error) {
            console.error('Error editing image:', error);
            throw error;
        }
    }

    static async deleteImage(id) {
        try {
            const response = await fetch(`/images/${id}`, { method: 'DELETE', headers: this.headers });
            return response;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    static async getTagsByImageId(id) {
        try {
            const response = await fetch(`/images/${id}/tags`, { headers: this.headers });
            if(!response.ok) {
                throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
            }
            const data = await response.json();
            return data;
        } catch (error) {
            if(error.cause === 404) {
                return [];
            }
            console.error('Error fetching tags by image id:', error);
            throw error;
        }
    }

    static async getCategoriesByImageId(id) {
        try {
            const response = await fetch(`/images/${id}/categories`, { headers: this.headers });
            if(!response.ok) {
                throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
            }
            const data = await response.json();
            return data;
        } catch (error) {
            //Not handling 404 because a image MUST have at least one category
            console.error('Error fetching categories by image id:', error);
            throw error;
        }
    }

    static async getCommentsByImageId(id) {
        try {
            const response = await fetch(`/images/${id}/comments`, { headers: this.headers });
            const data = await response.json();
            return data;
        } catch (error) {
            if(error.cause === 404) {
                return [];
            }
            console.error('Error fetching comments by image id:', error);
            throw error;
        }
    }

    static async addComment(imageId, content) {
        try {
            const response = await fetch(`/images/${imageId}/comments`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ content })
            });
            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }

    static async updateComment(imageId, commentId, content) {
        console.log("imageId, commentId, content: ", imageId, commentId, content);
        try {
            const response = await fetch(`/images/${imageId}/comments/${commentId}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify({ content })
            });
            if(!response.ok) {
                if(response.status === 401) {
                    throw new Error('Utente non autenticato.', { cause: response.status });
                }
                else if(response.status === 403) {
                    throw new Error('Non hai i permessi per modificare questo commento.', { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }
            return response;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    }

    static async deleteComment(imageId, commentId) {
        console.log("imageId, commentId: ", imageId, commentId);
        try {
            const response = await fetch(`/images/${imageId}/comments/${commentId}`, { method: 'DELETE', headers: this.headers });
            return response;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }

    static async isCommentLiked(imageId, commentId) {
        try {
            const response = await fetch(`/images/${imageId}/comments/${commentId}/isliked`, { headers: this.headers });
            const data = await response.json();
            return data.isLiked;
        } catch (error) {
            console.error('Error checking if comment is liked:', error);
            return false;
        }
    }

    static async likeComment(imageId, commentId) {
        try {
            const response = await fetch(`/images/${imageId}/comments/${commentId}/like`, { 
                method: 'POST',
                headers: this.headers 
            });
            return response;
        } catch (error) {
            console.error('Error liking comment:', error);
            throw error;
        }
    }

    static async unlikeComment(imageId, commentId) {
        try {
            const response = await fetch(`/images/${imageId}/comments/${commentId}/unlike`, {
                method: 'DELETE',
                headers: this.headers
            });
            return response;
        } catch (error) {
            console.error('Error unliking comment:', error);
            throw error;
        }
    }

    static async register(user) {
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(user)
            });

            if(!response.ok) {
                if(response.status === 409) {
                    throw new Error('Username o Email già in uso da un altro account.', { cause: response.status });
                }
                else if(response.status === 422) {
                    const json = await response.json();
                    const errors = json.errors;
                    const message = 'I seguenti campi non sono validi: ' + errors.map(
                        error => error.path
                    ).join(', ');
                    throw new Error(message, { cause: response.status });
                } 
                else {
                    const serverError = await response.json();
                    throw new Error(serverError.errors.message, { cause: response.status });
                }
            }

            return response;
        } catch(error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static async login(username, password) {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!response.ok) {
                if(response.status === 401) {
                    throw new Error('Username o password errati.', { cause: response.status });
                }
                else if(response.status === 422) {
                    throw new Error('Username o password mancanti o dal formato errato.', { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }

            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async logout() {
        try {
            const response = await fetch('/logout', {
                method: 'DELETE',
                headers: this.headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Logout failed', { cause: response.status });
            }
        } catch(error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    static async getUser(id) {
        try {
            const response = await fetch(`/users/${id}`, { headers: this.headers });
            if(!response.ok) {
                if(response.status === 404) {
                    throw new Error('Utente non trovato.', { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }
            const data = await response.json();
            return data;
        } catch (error) {
            if(!error.cause === 404) console.error('Error fetching user:', error);
            throw error;
        }
    }


    static async changePassword(oldPassword, newPassword, confirmPassword) {
        try {
            const response = await fetch('/change-password', {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
            });
            if(!response.ok) {
                if(response.status === 401) {
                    throw new Error('Vecchia password errata.', { cause: response.status });
                }
                else {
                    throw new Error('Errore lato server. Riprova più tardi.', { cause: response.status });
                }
            }
            return response;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }
}

export default API;