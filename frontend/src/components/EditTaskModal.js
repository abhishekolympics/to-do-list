// EditTaskModal.js
import React, { useState } from "react";
import "./EditTaskModal.css"; // Create a CSS file for styling

const EditTaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");

  const handleSave = () => {
    onSave(task._id, title, description);
    onClose();
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Task</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task Description"
          />
          <div className="ButtonsClass">
            <button onClick={handleSave} className="SaveButton">Save</button>
            <button onClick={onClose} className="SaveButton">Cancel</button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditTaskModal;
