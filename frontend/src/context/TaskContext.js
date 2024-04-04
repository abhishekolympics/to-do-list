// import React, { createContext, useState, useContext } from 'react';
// import useTask from '../hooks/useTask';

// const TaskContext = createContext();

// export const useTaskContext = () => useContext(TaskContext);

// export const TaskProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([]);
//   const { getAllTasks, addTask, deleteTask, updateTask } = useTask();

//   const fetchTasks = async () => {
//     try {
//       const tasksData = await getAllTasks();
//       setTasks(tasksData);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       // Handle error (e.g., display error message)
//     }
//   };

//   const handleAddTask = async (newTaskData) => {
//     try {
//       const newTask = await addTask(newTaskData);
//       setTasks([...tasks, newTask]);
//     } catch (error) {
//       console.error('Error adding task:', error);
//       // Handle error (e.g., display error message)
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await deleteTask(taskId);
//       setTasks(tasks.filter(task => task._id !== taskId));
//     } catch (error) {
//       console.error('Error deleting task:', error);
//       // Handle error (e.g., display error message)
//     }
//   };

//   const handleUpdateTask = async (taskId, updatedTaskData) => {
//     try {
//       const updatedTask = await updateTask(taskId, updatedTaskData);
//       setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
//     } catch (error) {
//       console.error('Error updating task:', error);
//       // Handle error (e.g., display error message)
//     }
//   };

//   return (
//     <TaskContext.Provider value={{ tasks, fetchTasks, handleAddTask, handleDeleteTask, handleUpdateTask }}>
//       {children}
//     </TaskContext.Provider>
//   );
// };
