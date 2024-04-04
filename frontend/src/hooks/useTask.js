// import { useTaskContext } from '../context/TaskContext';
// import api from '../utils/api';

// const useTask = () => {
//   const { tasks, fetchTasks } = useTaskContext();

//   const getAllTasks = async () => {
//     try {
//       const response = await api.get('/tasks');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       throw error;
//     }
//   };

//   const addTask = async (newTaskData) => {
//     try {
//       const response = await api.post('/tasks', newTaskData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding task:', error);
//       throw error;
//     }
//   };

//   const deleteTask = async (taskId) => {
//     try {
//       await api.delete(`/tasks/${taskId}`);
//     } catch (error) {
//       console.error('Error deleting task:', error);
//       throw error;
//     }
//   };

//   const updateTask = async (taskId, updatedTaskData) => {
//     try {
//       const response = await api.put(`/tasks/${taskId}`, updatedTaskData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating task:', error);
//       throw error;
//     }
//   };

//   return { tasks, fetchTasks, addTask, deleteTask, updateTask };
// };

// export default useTask;
