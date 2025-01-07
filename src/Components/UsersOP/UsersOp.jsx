import React, { useEffect, useState } from 'react';
import { userService } from '../../Services/UserService';
import Header from '../Header/Header';
import styles from './UsersOp.module.css';

const roleMapping = {
    '58D4CF0B-89BE-4630-A34A-6144C9E086FE': 'Cliente',
    'D75D5E20-A13A-45CC-81C1-64A46C0B482A': 'Admin',
};

const UsersOp = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({
        FullName: '',
        Email: '',
        PhoneNumber: '',
        BirthDate: '',
        Password: '',
        ConfirmPassword: '',
        Rol: '',
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (uuid) => {
        if (!uuid) {
            alert('Error: El UUID del usuario no está disponible.');
            return;
        }

        try {
            const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
            if (!confirmDelete) return;

            await userService.deleteUser(uuid);
            alert('Usuario eliminado con éxito');

            const updatedUsers = await userService.getUsers();
            setUsers(updatedUsers);
        } catch (error) {
            alert('Error al eliminar usuario: ' + error.message);
        }
    };

    const validateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age >= 18;
    };

    const validatePhone = (phone) => {
        // Remove any non-digit characters
        const digits = phone.replace(/\D/g, '');
        return digits.length <= 8;
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const { Password, ConfirmPassword, BirthDate, PhoneNumber } = newUser;

        // Phone validation
        if (!validatePhone(PhoneNumber)) {
            alert('El número de teléfono no debe tener más de 8 dígitos.');
            return;
        }

        // Age validation
        if (!validateAge(BirthDate)) {
            alert('El usuario debe ser mayor de 18 años para registrarse.');
            return;
        }

        if (Password !== ConfirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[.,@$!%*?&])[A-Za-z\d.,@$!%*?&]{8,}$/.test(Password)) {
            alert(
                'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (.,@$!%*?&)'
            );
            return;
        }

        const transformedUser = {
            FullName: newUser.FullName,
            Email: newUser.Email,
            PhoneNumber: newUser.PhoneNumber,
            PasswordHash: newUser.Password,
            BirthDate: newUser.BirthDate,
            Rol: newUser.Rol,
        };

        console.log('Datos transformados a enviar:', transformedUser);

        try {
            await userService.createUser(transformedUser);
            alert('Usuario agregado con éxito');

            setShowForm(false);
            setNewUser({
                FullName: '',
                Email: '',
                PhoneNumber: '',
                BirthDate: '',
                Password: '',
                ConfirmPassword: '',
                Rol: '',
            });

            const updatedUsers = await userService.getUsers();
            setUsers(updatedUsers);
        } catch (err) {
            alert('Error al agregar usuario: ' + err.message);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Only update if the new value would have 8 or fewer digits
        if (validatePhone(value)) {
            setNewUser({ ...newUser, PhoneNumber: value });
        }
    };

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Gestión de Usuarios</h1>
                <button
                    className={`${styles.button} ${showForm ? styles.cancelButton : ''}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancelar' : 'Agregar Usuario'}
                </button>
                {showForm && (
                    <form className={styles.form} onSubmit={handleAddUser}>
                        <div>
                            <label>Nombre: </label>
                            <input
                                type="text"
                                value={newUser.FullName}
                                onChange={(e) => setNewUser({ ...newUser, FullName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Email: </label>
                            <input
                                type="text"
                                value={newUser.Email}
                                onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Teléfono: </label>
                            <input
                                type="text"
                                value={newUser.PhoneNumber}
                                onChange={handlePhoneChange}
                                maxLength="8"
                                pattern="\d{1,8}"
                                title="Máximo 8 dígitos"
                                required
                            />
                        </div>
                        <div>
                            <label>Rol: </label>
                            <select
                                value={newUser.Rol}
                                onChange={(e) => setNewUser({ ...newUser, Rol: e.target.value })}
                            >
                                <option value="">Seleccione un rol</option>
                                {Object.keys(roleMapping).map((role) => (
                                    <option key={role} value={role}>
                                        {roleMapping[role]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Fecha de nacimiento: </label>
                            <input
                                type="date"
                                value={newUser.BirthDate}
                                onChange={(e) => setNewUser({ ...newUser, BirthDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Contraseña: </label>
                            <input
                                type="password"
                                value={newUser.Password}
                                onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Confirmar Contraseña: </label>
                            <input
                                type="password"
                                value={newUser.ConfirmPassword}
                                onChange={(e) => setNewUser({ ...newUser, ConfirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit">Guardar Usuario</button>
                    </form>
                )}

                <ul className={styles.userList}>
                    {users.map((user) => (
                        <li key={user.Uuid}>
                            <strong>Nombre:</strong> {user.FullName} <br />
                            <strong>Email:</strong> {user.Email} <br />
                            <strong>Teléfono:</strong> {user.PhoneNumber} <br />
                            <strong>Rol:</strong> {roleMapping[user.Rol] || 'Rol desconocido'} <br />
                            <button onClick={() => handleDeleteUser(user.Uuid)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UsersOp;