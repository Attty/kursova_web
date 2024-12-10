import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from './components/UserPage'; // Імпортуємо компонент профілю
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import AddPost from './components/AddPostPage';
import EditUser from './components/EditUserPage'
import EditPost from './components/EditPostPage'
import Posts from './components/PostsPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element = {<RegistrationForm/>}/>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path='/edit-user/:id' element = {<EditUser/>}/>
        <Route path='/edit-post/:id' element = {<EditPost/>}/>
        <Route path='/posts' element = {<Posts/>}/>
        <Route path='/add-post' element = {<AddPost/>}/>
        <Route path="/user/:id" element={<UserPage />} /> {/* Створюємо маршрут для профілю */}
      </Routes>
    </Router>
  );
};

export default App;
