import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewPost } from '../services/auth'; // Правильний імпорт функції
import { getFromLocalStorage } from '../utils/localStorage';
import './AddPostPage.css';

const AddPostPage = () => {
  const [postText, setPostText] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePostTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Викликаємо addNewPost, яке має повертати повідомлення
      const response = await addNewPost({ text: postText });
  
      // Якщо відповідь є повідомленням про успішне створення поста
      if (response === 'Post published successfully') {
        const loggedUser = getFromLocalStorage('user');
        if (loggedUser) {
          navigate(`/user/${loggedUser.id}`);
        } else {
          setError('User ID not found');
        }
      } else {
        setError('Failed to create post');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error while creating post');
    }
  };
  
  
  
  
  
  

  return (
    <div className="add-post-page">
      <h2>Create New Post</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={postText}
          onChange={handlePostTextChange}
          placeholder="Write your post..."
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPostPage;
