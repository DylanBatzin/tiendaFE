import { environment } from '../environments/environment';

class ProductService {
    baseUrl = environment.baseUrl;
    
    async getProducts() {
        try {
            const token = localStorage.getItem('jwt'); 
            if (!token) throw new Error('Token no proporcionado');
            const response = await fetch(`${this.baseUrl}products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
            
    }

    async getProductByUuid(uuid) {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error('Token no proporcionado');
            const response = await fetch(`${this.baseUrl}products/${uuid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }

            return await response.json();
        } catch (error) {
            console.error(`Error al obtener producto ${uuid}:`, error);
            throw error;
        }
    }



    async addProduct(productData) {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error('Token no proporcionado');
    
            const formData = new FormData();
            formData.append('Code', productData.Name);
            formData.append('Name', productData.Name);
            formData.append('Brand', productData.Brand);
            formData.append('stock', productData.Stock);
            formData.append('price', productData.Price);
            formData.append('Category', productData.Category);
            formData.append('Status', productData.Status);
            formData.append('image', productData.Image);
    
            const response = await fetch(`${this.baseUrl}products`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear producto');
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }


    async updateProduct(uuid, productData) {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error('Token no proporcionado');
    
            const formData = new FormData();
            formData.append('Code', productData.Code);
            formData.append('Name', productData.Name);
            formData.append('Brand', productData.Brand);
            formData.append('stock', productData.Stock);
            formData.append('price', productData.Price);
            formData.append('Category', productData.Category);
            formData.append('Status', productData.Status);
            formData.append('image', productData.Image);
    
            const response = await fetch(`${this.baseUrl}products/${uuid}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar producto');
            }
    
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar producto ${uuid}:`, error);
            throw error;
        }
    }

    async deleteProduct(uuid) {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error('Token no proporcionado');

            const response = await fetch(`${this.baseUrl}products/${uuid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar producto');
            }

            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar producto ${uuid}:`, error);
            throw error;
        }
    }
    
}export const productService = new ProductService();
