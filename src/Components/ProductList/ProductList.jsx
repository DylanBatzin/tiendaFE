import React from 'react';
import { productService } from '../../Services/ProductService';
import styles from './ProducLits.module.css';
import Header from '../Header/Header';

const Products = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [showForm, setShowForm] = React.useState(false);
    const [imagePreview, setImagePreview] = React.useState(null);
    const [newProduct, setNewProduct] = React.useState({
        Code: '',
        Name: '',
        Brand: '',
        price: '',
        Stock: '',
        Image: '',
        Status: '',
        Category: ''
    });
    const [isEditing, setIsEditing] = React.useState(false);
    const [editingProductUuid, setEditingProductUuid] = React.useState(null);

    const categories = [
        { name: 'Alimentos', value: '0d380422-6a8a-43a0-8dbb-109b7240906e' },
        { name: 'Electrónica', value: '2f215688-9652-474a-997a-7f70dcaf3d36' },
        { name: 'Productos para Mascotas', value: '7405b220-d4c0-43f5-bd5b-8d89f5ddd7cb' },
        { name: 'Higiene Personal', value: 'bc46b937-32fc-4975-af7c-b1f7dc36b27e' },
        { name: 'Papelería y Oficina', value: '0a01246a-1a13-4752-a0d6-ba71d4768eec' },
        { name: 'Limpieza', value: '80dc1755-0b48-4f5e-a8f1-fbd41a734a45' },
    ];
    const statuses = [
        { name: 'Activo', value: 'F190BE66-3B22-4E7D-85FC-C9C79E908642' },
        { name: 'Inactivo', value: '32A4E9A3-2255-4EF7-8440-A837E671641E' }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            setNewProduct({
                ...newProduct,
                Image: file
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor selecciona un archivo JPG o PNG");
            e.target.value = "";
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...newProduct,
                Price: parseFloat(newProduct.Price),
                Stock: parseInt(newProduct.Stock, 10),
            };
    
            console.log('Datos que se enviarán al servidor:', JSON.stringify(productData, null, 2));
    
            if (isEditing && editingProductUuid) {
                await productService.updateProduct(editingProductUuid, productData);
                alert('Producto actualizado exitosamente');
            } else {
                await productService.addProduct(productData);
                alert('Producto agregado exitosamente');
            }
    
            const updatedProducts = await productService.getProducts();
            setProducts(updatedProducts);
    
            setShowForm(false);
            setImagePreview(null);
            setNewProduct({
                Code: '',
                Name: '',
                Brand: '',
                price: '',
                Stock: '',
                Image: '',
                Status: '',
                Category: ''
            });
            setIsEditing(false);
            setEditingProductUuid(null);
        } catch (error) {
            console.error(isEditing ? 'Error al actualizar producto:' : 'Error al agregar producto:', error);
            alert(isEditing ? 'Error al actualizar el producto' : 'Error al agregar el producto');
        }
    };
    
    
    const handleEdit = async (product) => {
        try {
            const productData = await productService.getProductByUuid(product.Uuid);
            setNewProduct({
                Code: productData.Code,
                Name: productData.Name,
                Brand: productData.Brand,
                Price: productData.Price,
                Stock: productData.Stock,
                Image: '', 
                Status: productData.Status,
                Category: productData.Category
            });
            setImagePreview(productData.Image);
            setIsEditing(true);
            setEditingProductUuid(product.Uuid);
            setShowForm(true);
        } catch (error) {
            console.error('Error al cargar producto para editar:', error);
            alert('Error al cargar el producto para editar');
        }
    };

    const handleDelete = async (uuid) => {
        try {
            await productService.deleteProduct(uuid);
            setProducts(products.filter(p => p.Uuid !== uuid));
            alert('Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar producto');
        }
    };

    const handleAddProductClick = () => {
        setShowForm(!showForm);
        setIsEditing(false);
        setEditingProductUuid(null);
        setNewProduct({
            Code: '',
            Name: '',
            Brand: '',
            Price: '',
            Stock: '',
            Image: '',
            Status: '',
            Category: ''
        });
        setImagePreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value
        });
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error al obtener productos</div>;

    return (
        <div>
            <Header />
            <div className={styles.productContainer}>
                <h1>Listado de Productos</h1>
                <ul className={styles.productList}>
                    {products.map(product => (
                        <li key={product.Uuid} className={styles.productItem}>
                            <h3>{product.Name}</h3>
                            <img src={product.Image} alt={product.Name} />
                            <p>Precio: Q{product.Price}</p>
                            <p>Marca: {product.Brand}</p>
                            <p>Stock: {product.Stock}</p>
                            <div className={styles.buttonContainer}>
                                <button onClick={() => handleEdit(product)}>Editar</button>
                                <button onClick={() => handleDelete(product.Uuid)}>Eliminar</button>                            </div>
                        </li>
                    ))}
                </ul>

                <button onClick={handleAddProductClick} className={styles.addButton}>
                    {isEditing ? 'Cancelar edición' : 'Agregar productos'}
                </button>

                {showForm && (
                    <form className={styles.addProductForm} onSubmit={handleSubmit}>
                        <h3>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                        <label>
                            Código:
                            <input
                                type="text"
                                name="Code"
                                value={newProduct.Code}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                name="Name"
                                value={newProduct.Name}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Marca:
                            <input
                                type="text"
                                name="Brand"
                                value={newProduct.Brand}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Precio:
                            <input
                                type="number"
                                name="Price"
                                value={newProduct.Price}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Stock:
                            <input
                                type="number"
                                name="Stock"
                                value={newProduct.Stock}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Imagen:
                            <div className={styles.fileInput}>
                                <input
                                    type="file"
                                    name="Image"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleImageChange}
                                    required={!isEditing} 
                                />
                            </div>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className={styles.previewImage}
                                />
                            )}
                        </label>
                        <label>
                            Estado:
                            <select
                                name="Status"
                                value={newProduct.Status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un estado</option>
                                {statuses.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Categoría:
                            <select
                                name="Category"
                                value={newProduct.Category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button type="submit">{isEditing ? 'Actualizar Producto' : 'Guardar Producto'}</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Products;
