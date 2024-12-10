import React, { useState, useEffect } from 'react';
import { registerUser } from '../services/auth';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({ login: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = getFromLocalStorage('user');
    if (loggedUser) {
      navigate(`/user/${loggedUser.id}`);
    }
  }, [navigate]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(formData);
      saveToLocalStorage('user', {
        id: user.id,
        username: user.username,
        registrationDate: user.registrationDate,
      });
      setSuccess(true);
      setError('');
      navigate(`/user/${user.id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
      setSuccess(false);
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };
  

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Registration successful!</p>}
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
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            maxLength={30}
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-register">Register</button>
          <button
            type="button"
            className="btn btn-login"
            onClick={navigateToLogin}
          >
            Already have an account? Log in
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
