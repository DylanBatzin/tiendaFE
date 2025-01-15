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

    const STATUS_UUIDS = {
        RECHAZADO: '52315DBF-5E49-49F2-BE80-38CBF6B67ABB',
        EMPACANDO: '659D4B1D-BEB3-4712-A9D4-5E2843DEE02E',
        ENTREGADO: '6AA9A583-2A34-4934-B486-67498ADAE396',
        ENVIADO: '21E10D91-9411-47F6-BC35-7B4EC923AE3B',
        ATRASADO: 'F9B390AB-318C-4BC7-8C0D-A8D9284777E0',
        PROCESANDO: '6EB91343-C1DD-4FE0-AD42-FD479D5575F2',
    };

    const STATUS_NAMES = Object.fromEntries(
        Object.entries(STATUS_UUIDS).map(([key, value]) => [value, key])
    );

    const fetchOrders = async () => {
        try {
            const ordersData = await orderService.getAllOrders();

            const userRequests = ordersData.map((order) =>
                userService.getUserByUuid(order.UserUuid).catch(() => ({ FullName: 'Nombre no disponible' }))
            );
            const productRequests = ordersData.flatMap((order) =>
                (order.OrderDetails || []).map((detail) =>
                    productService.getProductByUuid(detail.ProductUuid).catch(() => ({ Name: 'Producto no disponible' }))
                )
            );

            const users = await Promise.all(userRequests);
            const products = await Promise.all(productRequests);

            const userNamesMap = {};
            users.forEach((user, index) => {
                userNamesMap[ordersData[index].UserUuid] = user.FullName || 'Nombre no disponible';
            });

            const productNamesMap = {};
            products.forEach((product, index) => {
                const productUuid = ordersData
                    .flatMap((order) => order.OrderDetails || [])
                    [index]?.ProductUuid;
                if (productUuid) productNamesMap[productUuid] = product.Name || 'Producto no disponible';
            });

            setUserNames(userNamesMap);
            setProductNames(productNamesMap);
            setOrders(ordersData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (order, newStatus) => {
        try {
            const updatedOrder = { ...order, StatusUuid: newStatus };
            await orderService.updateOrder(order.OrderUuid, updatedOrder);
            await fetchOrders();
        } catch (error) {
            console.error('Error al actualizar el estado de la orden:', error);
        }
    };

    const deleteOrder = async (order) => {
        try {
            await orderService.deleteOrder(order.OrderUuid);
            await fetchOrders();
        } catch (error) {
            console.error('Error al eliminar la orden:', error);
        }
    };

    const renderButtons = (order) => {
        switch (order.StatusUuid) {
            case STATUS_UUIDS.PROCESANDO:
                return (
                    <>
                        <button onClick={() => updateOrderStatus(order, STATUS_UUIDS.EMPACANDO)} className={styles.acceptButton}>
                            Aceptar
                        </button>
                        <button onClick={() => updateOrderStatus(order, STATUS_UUIDS.RECHAZADO)} className={styles.rejectButton}>
                            Rechazar
                        </button>
                    </>
                );
            case STATUS_UUIDS.RECHAZADO:
                return (
                    <button onClick={() => deleteOrder(order)} className={styles.deleteButton}>
                        Eliminar
                    </button>
                );
            case STATUS_UUIDS.EMPACANDO:
                return (
                    <>
                        <button onClick={() => updateOrderStatus(order, STATUS_UUIDS.ENVIADO)} className={styles.sendButton}>
                            Enviado
                        </button>
                        <button onClick={() => updateOrderStatus(order, STATUS_UUIDS.ATRASADO)} className={styles.delayedButton}>
                            Atrasado
                        </button>
                    </>
                );
            case STATUS_UUIDS.ENVIADO:
            case STATUS_UUIDS.ATRASADO:
                return (
                    <button onClick={() => updateOrderStatus(order, STATUS_UUIDS.ENTREGADO)} className={styles.deliveredButton}>
                        Entregado
                    </button>
                );
            default:
                return null;
        }
    };

    if (loading) return <p className={styles.loading}>Cargando órdenes...</p>;
    if (error) return <p className={styles.error}>Error: {error}</p>;

    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.ordersTitle}>Órdenes</h1>
            {orders.length === 0 ? (
                <p>No hay órdenes disponibles.</p>
            ) : (
                orders.map((order) => (
                    <div className={styles.orderCard} key={order.OrderUuid}>
                        <h2>Usuario: {userNames[order.UserUuid] || 'Nombre no disponible'}</h2>
                        <p>Total: {order.TotalAmount || 0}</p>
                        <p>Estado: {STATUS_NAMES[order.StatusUuid] || 'Desconocido'}</p>
                        <h3>Detalles</h3>
                        <ul>
                            {(order.OrderDetails || []).map((detail) => (
                                <li key={detail.ProductUuid}>
                                    Producto: {productNames[detail.ProductUuid] || 'Producto no disponible'}, 
                                    Cantidad: {detail.Quantity || 0}, 
                                    SubTotal: {detail.SubTotal || 0}
                                </li>
                            ))}
                        </ul>
                        <div className={styles.buttonsContainer}>
                            {renderButtons(order)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrdersList;
