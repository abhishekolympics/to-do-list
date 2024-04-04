import React, { useState } from 'react';
// import useTask from '../hooks/useTask';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
//   const { addTask } = useTask();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() !== '') {
    //   await addTask({ title });
      setTitle('');
    }
  };

  return (
    <div>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTaskForm;
