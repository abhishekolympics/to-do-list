const axios = require('axios');

// Register a new user
const register = async (userData) => {
  try {
    const res = await axios.post('/api/auth/register', userData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login user
const login = async (userData) => {
  try {
    const res = await axios.post('/api/auth/login', userData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default {
  register,
  login
};
