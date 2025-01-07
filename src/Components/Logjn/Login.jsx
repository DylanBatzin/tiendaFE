import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../Services/UserService'; 
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const loginData = {
        Email: email,
        Password: password,
      };
  
      try {
        const response = await userService.loginUser(loginData); 
        const { token, message } = response;
  
        
        localStorage.setItem('jwt', token);
  
       
        setSuccess(message);
        setError('');
  
        
        navigate('/home');
      } catch (err) {
        setError(err.message || 'Error al iniciar sesión');
        setSuccess('');
      }
    };
  

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Iniciar Sesión</h2>

        {success && <p className={styles.successMessage}>{success}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Ingresa tu correo" 
            className={styles.input} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Ingresa tu contraseña" 
            className={styles.input} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit" className={styles.button}>
          Entrar
        </button>

        <div className={styles.footer}>
          <a href="/forgot-password" className={styles.link}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
