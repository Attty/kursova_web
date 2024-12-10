import api from './api';

export const registerUser = async (data) => {
  try {
    const response = await api.post('/register', data);
    return response.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data; // Повертаємо весь об'єкт, що містить user і posts
  } catch (error) {
    throw new Error('User not found');
  }
};
export const loginUser = async (data) => {
  try {
    const response = await api.post('/login', data);
    return response.data.user; // Повертаємо об'єкт користувача
  } catch (error) {
    throw new Error('Invalid login or password');
  }
};
export const logoutUser = async () => {
  try {
    // Виконати POST запит на бекенд для логауту
    await api.post('/logout'); 
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Logout failed');
  }
};
export const deletePost = async (postId) => {
  try {
    await api.delete(`/post/${postId}`);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Error deleting post');
  }
};
export const addNewPost = async (postData) => {
  try {
    const response = await api.post('/publish', postData); // Відправляємо пост

    // Перевіряємо, чи відповідає статус 200 (OK)
    if (response.status === 200) {
      return 'Post published successfully'; // Повертаємо повідомлення про успіх
    } else {
      throw new Error('Failed to create post'); // Якщо статус не 200
    }
  } catch (error) {
    // Обробка помилки
    throw new Error(error.response?.data?.message || 'Failed to create post');
  }
};
export const updateUser = async (user) => {
  try {
    const response = await api.put('/user/edit', user);  // Використовуємо PUT запит

    // Перевіряємо, чи відповідає статус 200 (OK)
    if (response.status === 200) {
      return response.data; // Повертаємо дані про оновленого користувача
    } else {
      throw new Error('Failed to update user'); // Якщо статус не 200
    }
  } catch (error) {
    // Обробка помилки
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};
export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/post/${id}`, postData);  // Використовуємо PUT запит до /post/:id

    // Перевіряємо, чи відповідає статус 200 (OK)
    if (response.status === 200) {
      return response.data; // Повертаємо оновлені дані поста
    } else {
      throw new Error('Failed to update post'); // Якщо статус не 200
    }
  } catch (error) {
    // Обробка помилки
    throw new Error(error.response?.data?.message || 'Failed to update post');
  }
};
export const fetchPostData = async (id) => {
  try {
    const response = await api.get(`/post/${id}`); // Використовуємо GET запит для отримання поста
    return response.data; // Повертаємо дані поста
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Помилка при завантаженні поста');
  }
};
export const getPosts = async ({ page, pageSize }) => {
  try {
    // Використовуємо API клієнт для відправлення GET запиту на сервер
    const response = await api.get(`/posts?page=${page}&pageSize=${pageSize}`);
    
    // Повертаємо отримані дані
    return response.data;
  } catch (error) {
    // Обробка помилок
    throw new Error(error.response?.data?.message || 'Помилка при завантаженні постів');
  }
};