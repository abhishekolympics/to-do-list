import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <h1>Register</h1>
      {user ? (
        <p>You are already logged in as {user.username}.</p>
      ) : (
        <>
          <RegisterForm />
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </>
      )}
    </div>
  );
};

export default RegisterPage;
