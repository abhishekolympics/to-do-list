// Import axios or any other HTTP client library you prefer
import axios from 'axios';

// Define base URL for your backend API
const baseURL = 'https://to-do-list-production-8145.up.railway.app/api'; // Replace with your actual backend URL

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Export the api instance to use it for making HTTP requests
export default api;
