import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/auth';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = getFromLocalStorage('user');
    if (loggedUser) {
      navigate(`/user/${loggedUser.id}`); // Якщо є користувач, перенаправляємо на сторінку профілю
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData); // Очікуємо користувача у відповіді
      console.log('User data:', user); // Для діагностики
      saveToLocalStorage('user', {
        id: user.id,
        username: user.username,
        registrationDate: user.registrationDate,
      });
      setError('');
      navigate(`/user/${user.id}`); // Перенаправлення на сторінку профілю
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid login or password');
    }
  };
  

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Login:</label>
          <input
            type="text"
            name="login"
            maxLength={30}
            value={formData.login}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-login">Log In</button>
          <button
            type="button"
            className="btn btn-register"
            onClick={() => navigate('/register')}
          >
            Don’t have an account? Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
