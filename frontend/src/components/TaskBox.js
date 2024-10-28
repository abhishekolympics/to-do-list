import React from 'react';

const TaskBox = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-box">
      <h5>{task.title?.slice(0,10) || "No title available"}</h5>
      <p>{task.description?.slice(0, 15) || "No description available"}</p>
      <div className="task-box-buttons">
        <button className="edit-button" onClick={() => onEdit(task._id)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskBox;