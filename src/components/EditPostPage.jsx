import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // Імпортуємо useNavigate і useParams для отримання параметрів маршруту
import { updatePost, fetchPostData } from '../services/auth'; // Імпортуємо функції для оновлення поста та отримання даних поста
import { getFromLocalStorage } from '../utils/localStorage'; // Імпортуємо функцію для отримання користувача з локального сховища
import './EditPostPage.css';

const EditPostPage = () => {
  const [post, setPost] = useState({ text: '' });  // Початкове значення тексту поста
  const [error, setError] = useState(null);        // Для відображення помилок
  const { id } = useParams();  // Отримуємо id поста з URL
  const navigate = useNavigate();  // Для перенаправлення після збереження

  // Завантажуємо пост при завантаженні компонента
  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPostData(id);  // Викликаємо fetchPostData з сервісу
        setPost({ text: postData.text });  // Оновлюємо стейт тексту поста
      } catch (err) {
        setError('Сталася помилка при завантаженні поста');
      }
    };

    loadPost(); // Завантажуємо пост
  }, [id]);  // Викликається тільки при зміні id

  // Обробник зміни тексту
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Обробник відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, { text: post.text }); // Оновлюємо пост по id
      const user = getFromLocalStorage('user');  // Отримуємо користувача з локального сховища
      if (user && user.id) {
        navigate(`/user/${user.id}`);  // Перенаправляємо на сторінку користувача після успішного оновлення
      } else {
        setError('Не вдалося знайти дані користувача');
      }
    } catch (err) {
      setError('Сталася помилка при оновленні поста');
    }
  };

  // Обробник скасування
  const handleCancel = () => {
    const user = getFromLocalStorage('user');  // Отримуємо користувача з локального сховища
    if (user && user.id) {
      navigate(`/user/${user.id}`);  // Перенаправляємо на сторінку користувача, якщо скасовано
    } else {
      setError('Не вдалося знайти дані користувача');
    }
  };

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form">
        <h2>Редагувати пост</h2>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="text">Текст поста</label>
          <textarea
            id="text"
            name="text"
            value={post.text}
            onChange={handleChange}
            placeholder="Введіть текст поста"
            required
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

export default EditPostPage;
