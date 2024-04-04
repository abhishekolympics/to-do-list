import React, { useState } from 'react';
// import useTask from '../hooks/useTask';

const EditTaskForm = ({ task, onClose }) => {
  const [title, setTitle] = useState(task.title);
//   const { updateTask } = useTask();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() !== '') {
    //   await updateTask(task._id, { title });
      onClose();
    }
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit">Update Task</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditTaskForm;
