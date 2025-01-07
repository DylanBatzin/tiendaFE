import React, { useEffect, useState } from 'react';
import { orderService } from '../../Services/OrdersService';
import { userService } from '../../Services/UserService';
import { productService } from '../../Services/ProductService';
import styles from './orders.module.css';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userNames, setUserNames] = useState({});
    const [productNames, setProductNames] = useState({}); 
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersData = await orderService.getOrdersByStatus();
                setOrders(ordersData);

                const names = {};
                const products = {};

                for (const order of ordersData) {
                    try {
                        const user = await userService.getUserByUuid(order.UserUuid);
                        names[order.UserUuid] = user.FullName || 'Nombre no disponible';
                    } catch {
                        names[order.UserUuid] = 'Nombre no disponible';
                    }

                    for (const detail of order.OrderDetails) {
                        if (!products[detail.ProductUuid]) {
                            try {
                                const product = await productService.getProductByUuid(detail.ProductUuid);
                                products[detail.ProductUuid] = product.Name || 'Producto no disponible';
                            } catch {
                                products[detail.ProductUuid] = 'Producto no disponible';
                            }
                        }
                    }
                }

                setUserNames(names);
                setProductNames(products);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleAccept = async (order) => {
        const updatedOrder = {
            ...order,
            StatusUuid: '659D4B1D-BEB3-4712-A9D4-5E2843DEE02E'
        };

        try {
            const updatedOrderResponse = await orderService.updateOrder(order.OrderUuid, updatedOrder);
            console.log('Orden aceptada:', updatedOrderResponse);
            setOrders(orders.map(o => o.OrderUuid === order.OrderUuid ? updatedOrderResponse : o)); // Update order in state

            window.location.reload();
        } catch (error) {
            console.error('Error al aceptar la orden:', error);
        }
    };

    const handleReject = async (order) => {
        const updatedOrder = {
            ...order,
            StatusUuid: '52315DBF-5E49-49F2-BE80-38CBF6B67ABB'
        };

        try {
            const updatedOrderResponse = await orderService.updateOrder(order.OrderUuid, updatedOrder);
            console.log('Orden rechazada:', updatedOrderResponse);
            setOrders(orders.map(o => o.OrderUuid === order.OrderUuid ? updatedOrderResponse : o)); 
            window.location.reload();
        } catch (error) {
            console.error('Error al rechazar la orden:', error);
        }
    };

    if (loading) return <p className={styles.loading}>Cargando órdenes...</p>;
    if (error) return <p className={styles.error}>Error: {error}</p>;

    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.ordersTitle}>Órdenes</h1>
            {orders.map((order) => (
                <div className={styles.orderCard} key={order.OrderUuid}>
                    <h2>Usuario: {userNames[order.UserUuid]}</h2>
                    <p>Total: {order.TotalAmount}</p>
                    <p>Estado: {order.StatusUuid}</p>
                    <h3>Detalles</h3>
                    <ul>
                        {order.OrderDetails.map((detail, index) => (
                            <li key={index}>
                                Producto: {productNames[detail.ProductUuid]}, 
                                Cantidad: {detail.Quantity}, 
                                SubTotal: {detail.SubTotal}
                            </li>
                        ))}
                    </ul>
                    <div className={styles.buttonsContainer}>
                        <button onClick={() => handleAccept(order)} className={styles.acceptButton}>Aceptar</button>
                        <button onClick={() => handleReject(order)} className={styles.rejectButton}>Rechazar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrdersList;
