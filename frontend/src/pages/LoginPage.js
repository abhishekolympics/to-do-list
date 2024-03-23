import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import { useAuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <h1>Login</h1>
      {user ? (
        <p>You are already logged in as {user.username}.</p>
      ) : (
        <>
          <LoginForm />
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </>
      )}
    </div>
  );
};

export default LoginPage;
