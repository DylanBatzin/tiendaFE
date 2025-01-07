import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import { userService } from '../../Services/UserService'; 
import Header from '../Header/Header';
import styles from './User.module.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validateName = (name) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(name);
    const validatePassword = (password) => 
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&,\.])[A-Za-z\d@$!%*?&,\.]{8,}$/.test(password);
    const passwordsMatch = () => newPassword === confirmPassword;

    const getEmailFromJWT = () => {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        try {
            const decodedToken = jwtDecode(token); 
            return decodedToken.email; 
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    };

    const email = getEmailFromJWT(); 

    useEffect(() => {
        if (!email) {
            console.error('No se pudo obtener el email del JWT');
            return;
        }

        const fetchUser = async () => {
            try {
                const userData = await userService.getUserByEmail(email);
                setUser(userData);
            } catch (error) {
                console.error('Error al cargar el perfil del usuario:', error);
            }
        };

        fetchUser();
    }, [email]);

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleFieldChange = (field, value) => {
        setUser({ ...user, [field]: value });

        if (field === 'FullName' && validateName(value)) {
            setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
        }

        if (field === 'newPassword' && validatePassword(value)) {
            setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
        }

        if (field === 'confirmPassword' && passwordsMatch()) {
            setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
        }
    };

    const handleSaveChanges = () => {
        const newErrors = {};
    
        if (!validateName(user.FullName)) {
            newErrors.name = 'El nombre no puede contener números.';
        }
    
        if (newPassword && !validatePassword(newPassword)) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un símbolo.';
        }
    
        if (newPassword && !passwordsMatch()) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length === 0) {
            if (!user.Uuid) {
                console.error('No se encontró el Uuid del usuario');
                return;
            }
    
            const updatedUser = {
                FullName: user.FullName,
                Email: user.Email,
                PhoneNumber: user.PhoneNumber,
                PasswordHash: newPassword || user.PasswordHash,
                BirthDate: user.BirthDate,
                Rol: user.Rol
            };
    
            console.log('Uuid del usuario:', user.Uuid); 
            console.log('Datos a enviar:', updatedUser);
    
            userService.updateUser(user.Uuid, updatedUser)
                .then(() => {
                    console.log('Usuario actualizado correctamente');
                    setIsEditMode(false);
                })
                .catch((error) => {
                    console.error('Error al actualizar el usuario:', error);
                    setErrors(prev => ({
                        ...prev,
                        general: 'Error al actualizar el usuario. Por favor, intente nuevamente.'
                    }));
                });
        }
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h2 className={styles.header}>Perfil de Usuario</h2>
                <div className={styles.userInfo}>
                    <p><strong>Nombre:</strong> {user.FullName}</p>
                    <p><strong>Email:</strong> {user.Email}</p>
                    <p><strong>Teléfono:</strong> {user.PhoneNumber}</p>
                    <p><strong>Fecha de Nacimimiento: </strong> {new Date(user.BirthDate).toLocaleDateString()}</p>
                </div>
                {isEditMode ? (
                    <div className={styles.editForm}>
                        <h3>Editar Perfil</h3>
                        <form>
                            <label>
                                Nombre:
                                <input 
                                    type="text" 
                                    defaultValue={user.FullName} 
                                    onChange={(e) => handleFieldChange('FullName', e.target.value)} 
                                />
                                {errors.name && <p className={styles.error}>{errors.name}</p>}
                            </label>
                            <label>
                                Email:
                                <input 
                                    type="Email" 
                                    defaultValue={user.Email} 
                                    onChange={(e) => handleFieldChange('Email', e.target.value)} 
                                />
                                {errors.email && <p className={styles.error}>{errors.email}</p>}
                            </label>
                            <label>
                                Teléfono:
                                <input 
                                    type="text" 
                                    defaultValue={user.PhoneNumber} 
                                    onChange={(e) => handleFieldChange('PhoneNumber', e.target.value)} 
                                />
                                {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}
                            </label>
                            <label>
                                Fecha de Nacimiento:
                                <input 
                                    type="date" 
                                    defaultValue={new Date(user.BirthDate).toISOString().split('T')[0]}
                                    onChange={(e) => handleFieldChange('BirthDate', e.target.value)}
                                />
                                {errors.birthDate && <p className={styles.error}>{errors.birthDate}</p>}
                            </label>
                            <label>
                                Nueva Contraseña:
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        handleFieldChange('newPassword', e.target.value);
                                    }}
                                />
                                {errors.password && <p className={styles.error}>{errors.password}</p>}
                            </label>
                            <label>
                                Confirmar Nueva Contraseña:
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        handleFieldChange('confirmPassword', e.target.value);
                                    }}
                                />
                                {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
                            </label>
                            <button type="button" onClick={handleSaveChanges}>
                                Guardar Cambios
                            </button>
                            <button type="button" onClick={() => setIsEditMode(false)}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                ) : (
                    <button 
                        className={styles.editButton} 
                        onClick={handleEditClick}
                    >
                        Editar Perfil
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserProfile;

