import React, { useEffect, useState } from 'react';
import { userService } from '../../Services/UserService';
import { orderService } from '../../Services/OrdersService';
import styles from './Cart.module.css';
import Header from '../Header/Header';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderProcessing, setOrderProcessing] = useState(false);

    useEffect(() => {
        const initializeCart = async () => {
            try {
                const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
                setCart(storedCart);

                const token = localStorage.getItem('jwt');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const email = payload.email;
                    const user = await userService.getUserByEmail(email);
                    setUserData(user);
                }
            } catch (err) {
                setError('Error loading user data');
                console.error('Error initializing cart:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeCart();
    }, []);

    const removeFromCart = (Uuid) => {
        const updatedCart = cart.filter(item => item.Uuid !== Uuid);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const updateQuantity = (Uuid, newQuantity) => {
        if (newQuantity <= 0) return;
        const updatedCart = cart.map(item =>
            item.Uuid === Uuid ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.Price * item.quantity), 0).toFixed(2);
    };

    const createOrder = async () => {
        if (!userData || orderProcessing) return;

        setOrderProcessing(true);
        try {
            const orderData = {
                UserUuid: userData.Uuid,
                TotalAmount: parseFloat(getTotal()),
                StatusUuid: "6eb91343-c1dd-4fe0-ad42-fd479d5575f2", 
                OrderDetails: cart.map(item => ({
                    ProductUuid: item.Uuid,
                    Quantity: item.quantity,
                    SubTotal: item.Price * item.quantity
                }))
            };

            await orderService.createOrder(orderData);
            
            localStorage.removeItem('cart');
            setCart([]);
            alert('¡Pedido creado exitosamente!');

        } catch (error) {
            console.error('Error al crear el pedido:', error);
            alert('Error al crear el pedido. Por favor, intente nuevamente.');
        } finally {
            setOrderProcessing(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className={styles['cart-container']}>
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <div className={styles['cart-container']}>
                    <p className={styles.error}>{error}</p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div>
                <Header />
                <div className={styles['cart-container']}>
                    <h2>El carrito está vacío</h2>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className={styles['cart-container']}>
                {userData && (
                    <div className={styles['user-info']}>
                        <p>Cliente: {userData.FullName}</p>
                        <p>Email: {userData.Email}</p>
                    </div>
                )}
                <h2>Carrito de Compras</h2>
                <ul className={styles['cart-list']}>
                    {cart.map((item) => (
                        <li key={item.Uuid} className={styles['cart-item']}>
                            <img
                                src={item.Image}
                                alt={item.Name}
                            />
                            <div className={styles['cart-item-details']}>
                                <h3>{item.Name}</h3>
                                <p>Precio: Q{item.Price.toFixed(2)}</p>
                                <div className={styles['quantity-container']}>
                                    <label>Cantidad: </label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.Uuid, parseInt(e.target.value))}
                                        min="1"
                                    />
                                </div>
                                <p>Subtotal: Q{(item.Price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button
                                className={styles['remove-button']}
                                onClick={() => removeFromCart(item.Uuid)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
                <div className={styles['total-container']}>
                    <h3>Total: Q{getTotal()}</h3>
                    <button 
                        className={styles['order-button']}
                        onClick={createOrder}
                        disabled={orderProcessing}
                    >
                        {orderProcessing ? 'Procesando...' : 'Realizar Pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;