import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <h1>Welcome to My Todo List App</h1>
      {user ? (
        <p>Hello, {user.username}! You are logged in.</p>
      ) : (
        <div>
          <p>This is the home page of our Todo List application.</p>
          <p>You can click the buttons below to navigate:</p>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/register"><button>Register</button></Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
