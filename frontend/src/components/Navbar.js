import React from 'react';

const Navbar = ({ username, onLogout, onCreateTask }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button onClick={onCreateTask}>Create Task</button>
      </div>
      <div className="navbar-center">
        <h1 className="navbar-title">Task List</h1>
      </div>
      <div className="navbar-right">
        <span>{username}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;