import React from 'react';
import  {jwtDecode}  from 'jwt-decode';
import  styles  from "./Header.module.css";

const Header = () => {

    const token = localStorage.getItem('jwt');
    let role = null;
    if (token) {
        const decoded = jwtDecode(token);
        role = decoded.role;
    }

    const renderNvar = () => {
        if (role === '58D4CF0B-89BE-4630-A34A-6144C9E086FE'){
            return (
                <ul>
                    <li><a href="/home" className={styles.link}>Productos</a></li>
                    <li><a href="/history" className={styles.link}>Historial</a></li>
                    <li><a href="/cart" className={styles.link}><box-icon name='cart-alt' background='white' color="#ecf0f1"></box-icon></a></li>
                    <li><a href="/account" className={styles.link}><box-icon name='user' background='white' color="#ecf0f1"></box-icon></a></li>
                   
                </ul>
            );

        }else if (role === 'D75D5E20-A13A-45CC-81C1-64A46C0B482A') { 
            return (
                <ul>
                    <li><a href="/products" className={styles.link}>Gestionar Productos</a></li>
                    <li><a href="/home" className={styles.link}>Pedidos</a></li>
                    <li><a href="/Users" className={styles.link}>Gestionar Usuarios</a></li>
                    <li><a href="/account" className={styles.link}><box-icon name='user' background='white' color="#ecf0f1"></box-icon></a></li>
                </ul>
            );
        } else if (role === 'D04011B0-6F35-4DD6-89E8-99DCEB1D1B3D') {
            return (
                <ul>
                    <li><a href="/admin-dashboard" className={styles.link}>Dashboard</a></li>
                    <li><a href="/manage-users" className={styles.link}>Usuarios</a></li>
                    <li><a href="/reports" className={styles.link}>Reportes</a></li>
                </ul>
            );
        } else {
            return null; 
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>Mi Tiendita Online</div>
            <nav className={styles.nav}>
                {renderNvar()}
            </nav>
        </header>
    );
};

export default Header;