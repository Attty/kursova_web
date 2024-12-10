import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../services/auth';
import { getFromLocalStorage } from '../utils/localStorage';
import './PostsPage.css';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getFromLocalStorage('user');
    setCurrentUser(user);

    const fetchPosts = async () => {
      setLoading(true);
      setError(null); // Очищення помилки перед завантаженням
      try {
        const response = await getPosts({ page, pageSize: 10 });
        if (response && Array.isArray(response)) {
          const uniquePosts = [
            ...new Map([...posts, ...response].map(post => [post.id, post])).values(),
          ];
          setPosts(uniquePosts);
          if (response.length < 10) setHasMore(false);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError('Сталася помилка при завантаженні постів');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handleUserClick = userId => navigate(`/user/${userId}`);
  const loadMorePosts = () => hasMore && setPage(prevPage => prevPage + 1);

  return (
    <div className="posts-page">
      <div className="user-header">
        {currentUser && (
          <div className="user-info">
            <h2 onClick={() => handleUserClick(currentUser.id)}>{currentUser.username}</h2>
          </div>
        )}
      </div>

      <h2 className="section-title">Пости</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <span
                  className="author-name"
                  onClick={() => handleUserClick(post.userId)}
                >
                  {post.username}
                </span>
                <span className="post-date">
                  {new Date(post.publicationTime).toLocaleString()}
                </span>
              </div>
              <p>{post.text}</p>
            </div>
          ))
        ) : (
          !loading && <p className="no-posts">Немає постів для відображення</p>
        )}
      </div>

      {hasMore && !loading && (
        <button className="btn btn-load-more" onClick={loadMorePosts}>
          Завантажити ще
        </button>
      )}

      {loading && <div className="loading-message">Завантаження...</div>}
    </div>
  );
};

export default PostsPage;
