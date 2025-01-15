import React from 'react';
import styles from './Alert.module.css';

const AnimatedAlert = ({ message, show, type = 'success', children }) => {
    return (
        <div
            className={`${styles.alertContainer} 
                        ${show ? styles.show : ''} 
                        ${styles[type]}`}
        >
            <span>{message}</span>
            {children && <div className={styles.alertActions}>{children}</div>}
        </div>
    );
};

export default AnimatedAlert;
