import React, { useState } from "react";
import "./EditTaskModal.css"; // Create a CSS file for styling

const AddTaskModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    onSave(title, description);
    onClose();
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Create New Task</h2>
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

export default AddTaskModal;
