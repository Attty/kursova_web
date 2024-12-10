import axios from 'axios';

const API = axios.create({
  baseURL: 'https://6416-178-95-68-105.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Дозволяє відправляти куки, якщо необхідно
});


export default API;
