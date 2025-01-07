import React from 'react';
import { productService } from '../../Services/ProductService';
import styles from './Products.module.css';


const Products = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getProducts();
                setProducts(response);
                setError(null);
            } catch (error) {
                console.error('Error al obtener productos:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.Uuid === product.Uuid);

        if (existingProduct) {
            existingProduct.quantity += 1; 
        } else {
            cart.push({ ...product, quantity: 1 }); 
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.Name} agregado al carrito`);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error al obtener productos</div>;

    return (
        <div className={styles['products-container']}>
            <h1>Lista de Productos</h1>
            <ul className={styles['products-list']}>
                {products.map((product) => (
                    <li key={product.Uuid} className={styles['product-item']}>
                        <img src={product.Image} alt={product.Name} />
                        <h2>{product.Name}</h2>
                        <p>Marca: {product.Brand}</p>
                        <p>Precio: Q{product.Price.toFixed(2)}</p>
                        <p>Stock: {product.Stock}</p>
                        <button onClick={() => addToCart(product)}>+</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;