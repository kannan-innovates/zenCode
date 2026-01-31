import axios from 'axios';
import { showError } from '../utils/toast.util';

const API_URL = import.meta.env.VITE_API_URL ||'http://localhost:5001/api';

const api = axios.create({
     baseURL: API_URL,
     headers : {
          'Content-Type': 'application/json',
     },
});

api.interceptors.response.use(
     (response) => response,
     async(error) =>{
          const message = error.response?.data?.message ||'Something went wrong';
          showError(message);
          return Promise.reject(error);
     }
);

export default api;