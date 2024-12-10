import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Імпортуємо useNavigate
import { updateUser } from '../services/auth';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage'; // Імпортуємо функції
import './EditUserPage.css';

const EditUserPage = () => {
  const [user, setUser] = useState({ username: '', password: null });
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Використовуємо useNavigate для перенаправлення
  
  useEffect(() => {
    // Ініціалізуємо дані користувача з локального сховища
    const storedUser = getFromLocalStorage('user');
    if (storedUser) {
      setUser({
        username: storedUser.username,
        password: null,  // Пусте поле для пароля
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(user);
      if (response.user) {
        // Оновлюємо дані в локальному сховищі
        saveToLocalStorage('user', response.user);  // Зберігаємо оновленого користувача
        // Перенаправлення на сторінку користувача
        navigate(`/user/${response.user.id}`);
      }
    } catch (err) {
      setError('Сталася помилка при оновленні');
    }
  };

  const handleCancel = () => {
    // Якщо відміна, перенаправляємо на сторінку користувача
    const storedUser = getFromLocalStorage('user');
    if (storedUser) {
      navigate(`/user/${storedUser.id}`);
    }
  };

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form">
        <h2>Редагувати профіль</h2>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Юзернейм</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="Залиште порожнім, якщо не змінюєте"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password || ''}
            onChange={handleChange}
            placeholder="Залиште порожнім, якщо не змінюєте"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save">Зберегти</button>
          <button type="button" className="btn btn-cancel" onClick={handleCancel}>Відміна</button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
