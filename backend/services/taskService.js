import axios from 'axios';

// Get all tasks
const getAllTasks = async () => {
  try {
    const res = await axios.get('/api/tasks');
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Add a new task
const addTask = async (taskData) => {
  try {
    const res = await axios.post('/api/tasks', taskData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a task
const deleteTask = async (taskId) => {
  try {
    const res = await axios.delete(`/api/tasks/${taskId}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update a task
const updateTask = async (taskId, taskData) => {
  try {
    const res = await axios.put(`/api/tasks/${taskId}`, taskData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default {
  getAllTasks,
  addTask,
  deleteTask,
  updateTask
};
