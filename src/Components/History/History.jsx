import React, { useEffect, useState } from 'react';
import { orderService } from '../../Services/OrdersService';
import { userService } from '../../Services/UserService';
import { productService } from '../../Services/ProductService';
import { jwtDecode } from 'jwt-decode';
import Header from '../Header/Header';
import styles from './History.module.css'; 

const History = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userUuid, setUserUuid] = useState(null);

    const statusMapping = {
        "6EB91343-C1DD-4FE0-AD42-FD479D5575F2": "Procesando",
        "52315DBF-5E49-49F2-BE80-38CBF6B67ABB": "Rechazado",
        "659D4B1D-BEB3-4712-A9D4-5E2843DEE02E": "Empacando",
        "6AA9A583-2A34-4934-B486-67498ADAE396": "Entregado",
        "21E10D91-9411-47F6-BC35-7B4EC923AE3B": "Enviado",
        "32A4E9A3-2255-4EF7-8440-A837E671641E": "Inactivo",
        "F9B390AB-318C-4BC7-8C0D-A8D9284777E0": "Atrasado",
        "F190BE66-3B22-4E7D-85FC-C9C79E908642": "Activo",
    };

    const handleDeleteOrder = async (orderUuid) => {
        try {
            const result = await orderService.deleteOrder(orderUuid);
            alert(result.message);
            setOrders(orders.filter(order => order.OrderUuid !== orderUuid));
        } catch (error) {
            alert('Error al eliminar la orden: ' + error.message);
        }
    };

    useEffect(() => {
        const fetchUserAndOrders = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('Token no encontrado en localStorage');
                }

                const { email } = jwtDecode(token);
                console.log('Email obtenido del token:', email);

                const user = await userService.getUserByEmail(email);
                console.log('Usuario obtenido:', user);

                const uuid = user.Uuid || user.uuid;
                if (!uuid) {
                    throw new Error('El usuario no tiene un UUID válido');
                }

                setUserUuid(uuid);
                console.log('UUID asignado:', uuid);

                const ordersData = await orderService.getOrdersByUser(uuid);
                console.log('Órdenes obtenidas:', ordersData);
                
                const updatedOrders = await Promise.all(
                    ordersData.map(async (order) => {
                        const productsData = await Promise.all(
                            order.OrderDetails.map(async (detail) => {
                                try {
                                    const product = await productService.getProductByUuid(detail.ProductUuid);
                                    return { ...detail, productName: product.Name || 'Producto no disponible' };
                                } catch {
                                    return { ...detail, productName: 'Producto no disponible' };
                                }
                            })
                        );

                        return { ...order, OrderDetails: productsData };
                    })
                );

                setOrders(updatedOrders);
            } catch (err) {
                setError(err.message || 'Error al cargar los datos.');
                console.error('Error en fetchUserAndOrders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndOrders();
    }, []);

    if (loading) {
        return <p className={styles.loadingText}>Cargando órdenes...</p>;
    }

    if (error) {
        return <p className={styles.errorText}>Error: {error}</p>;
    }

    return (
        <div>
            <Header />
            <div className={styles.historyContainer}>
                <h1 className={styles.historyTitle}>Historial de Órdenes</h1>
                {orders.length === 0 ? (
                    <p className={styles.noOrdersText}>No hay órdenes disponibles.</p>
                ) : (
                    <ul className={styles.orderList}>
                        {orders.map((order) => (
                            <li key={order.OrderUuid} className={styles.orderItem}>
                                <h3>Orden ID: {order.OrderUuid}</h3>
                                <p><strong>Total:</strong> ${order.TotalAmount}</p>
                                <p><strong>Estado:</strong> {statusMapping[order.StatusUuid]}</p>
                                <div className={styles.orderDetails}>
                                    {order.OrderDetails.map((detail, index) => (
                                        <div key={index} className={styles.productDetail}>
                                            <p><strong>Producto:</strong> {detail.productName}</p>
                                            <p><strong>Cantidad:</strong> {detail.Quantity}</p>
                                            <p><strong>Subtotal:</strong> ${detail.SubTotal}</p>
                                        </div>
                                    ))}
                                </div>
                                {order.StatusUuid === "6EB91343-C1DD-4FE0-AD42-FD479D5575F2" && (
                                   <button onClick={() => handleDeleteOrder(order.OrderUuid)}>Cancelar</button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default History;
