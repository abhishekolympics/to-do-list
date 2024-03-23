import React from 'react';
import useTask from '../hooks/useTask';

const TaskItem = ({ task }) => {
  const { deleteTask } = useTask();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
    }
  };

  return (
    <div>
      <p>{task.title}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TaskItem;
