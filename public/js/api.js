class API {
    static BASE_URL = ''; // Empty since we're using relative paths

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
            return null;
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
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching random images: ', error);
            return [];
        }
    }

    static async searchImages(query) {
        try {
            const response = await fetch(`/api/images/search?q=${encodeURIComponent(query)}`, { 
                headers: this.headers 
            });
            const data = await response.json();
            return data.images;
        } catch (error) {
            console.error('Error searching images:', error);
            return [];
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
                const error = await response.json();
                console.log(error)
                throw new Error(error.message || 'Login failed');
            }

            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error; // Re-throw to handle it in the UI
        }
    }

    static async uploadImage(data) {
        try {
            const response = await fetch('/images/upload', {
                method: 'POST',
                headers: this.multipartHeaders,
                body: data
            });

            if(!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Upload Image failed');
            }

            return response;
        } catch (error) {
            console.error('Upload Image error: ', error);
            throw error;
        }
    }
}

export default API;
