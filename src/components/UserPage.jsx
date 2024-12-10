import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFromLocalStorage, removeFromLocalStorage } from '../utils/localStorage';
import { getUserById, logoutUser, deletePost } from '../services/auth'; // У сервісі не потрібно додавати getPosts
import './UserPage.css'; // Підключення стилів

const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loggedUser = getFromLocalStorage('user');
    if (loggedUser && loggedUser.id === parseInt(id)) {
      setIsOwner(true);
    }

    const fetchUserData = async () => {
      try {
        const response = await getUserById(id);
        if (response?.user && Array.isArray(response.posts)) {
          setUserData(response.user);
          setUserPosts(response.posts);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        setError('User not found or API error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleLogout = async () => {
    try {
      // Викликаємо logoutUser для логауту на бекенді
      await logoutUser();
      
      // Видаляємо дані з Local Storage
      removeFromLocalStorage('user');
      setError('');
      navigate('/login'); // Перенаправлення на сторінку логіну
    } catch (err) {
      console.error('Logout error:', err);
      setError('Error during logout');
    }
  };

  const handleEditUser = () => {
    navigate(`/edit-user/${id}`);
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    try {
      // Викликаємо API для видалення поста
      await deletePost(postId);
      
      // Оновлюємо список постів після видалення
      setUserPosts(userPosts.filter(post => post.id !== postId));
      setError('');
    } catch (err) {
      console.error('Delete post error:', err);
      setError('Error during post deletion');
    }
  };

  const handleAddPost = () => {
    navigate(`/add-post`);
  };

  const handleViewAllPosts = () => {
    navigate(`/posts`);  // Перенаправлення на сторінку з усіма постами користувача
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-page">
      <div className="user-profile">
        <h2>User Profile</h2>
        <div className="profile-details">
          <p><strong>Username:</strong> {userData?.username}</p>
          <p>
            <strong>Registration Date:</strong>{' '}
            {new Date(userData?.registrationDate).toLocaleString()}
          </p>
        </div>
        {isOwner && (
          <div className="profile-actions">
            <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
            <button className="btn btn-edit" onClick={handleEditUser}>Edit User</button>
            <button className="btn btn-add-post" onClick={handleAddPost}>Add Post</button> {/* Кнопка додавання поста */}
          </div>
        )}
        <div className="profile-actions">
          <button className="btn btn-view-all-posts" onClick={handleViewAllPosts}>View All Posts</button> {/* Кнопка перегляду всіх постів для кожного користувача */}
        </div>
      </div>

      <div className="user-posts">
        <h3>User Posts</h3>
        {userPosts.length > 0 ? (
          <ul>
            {userPosts.map((post) => (
              <li className="post" key={post.id}>
                <p><strong>Text:</strong> {post.text}</p>
                <p>
                  <strong>Publication Time:</strong>{' '}
                  {new Date(post.publicationTime).toLocaleString()}
                </p>
                {isOwner && (
                  <div className="post-actions">
                    <button className="btn btn-edit" onClick={() => handleEditPost(post.id)}>
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDeletePost(post.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
