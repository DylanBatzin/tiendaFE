import { environment } from '../environments/environment';

class OrderService {
    baseUrl = environment.baseUrl;

   
    async getOrdersByStatus() {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error('Token no proporcionado');

            const response = await fetch(`${this.baseUrl}orders/status`, {
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
            console.error('Error al obtener órdenes:', error);
            throw error;
        }
    }

    async updateOrder(uuid, orderData) {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) throw new Error('Token no proporcionado');

            const response = await fetch(`${this.baseUrl}orders/${uuid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la orden');
            }

            const updatedOrder = await response.json();
            return updatedOrder;
        } catch (error) {
            throw error;
        }
    }

async createOrder(orderData) {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('Token no proporcionado');

        const response = await fetch(`${this.baseUrl}orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear la orden');
        }

        const newOrder = await response.json();
        console.log('Respuesta de la API (POST create):', newOrder); 
        return newOrder;
    } catch (error) {
        console.error('Error al crear la orden:', error);
        throw error;
    }
}


async getOrdersByUser(userUuid) {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('Token no proporcionado');

        const response = await fetch(`${this.baseUrl}orders/user/${userUuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las órdenes del usuario');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener órdenes del usuario:', error);
        throw error;
    }
}
async deleteOrder(uuid) {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('Token no proporcionado');

        const response = await fetch(`${this.baseUrl}orders/${uuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar la orden');
        }

        const result = await response.json();
        console.log('Orden eliminada:', result);
        return result;
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        throw error;
    }
}

}

export const orderService = new OrderService();
