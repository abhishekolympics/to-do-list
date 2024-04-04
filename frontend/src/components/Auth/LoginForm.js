/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
// eslint-disable-next-line jsx-a11y/anchor-is-valid
import React, { useState } from "react";
import "./styles.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// import {FontAwesomeIcon} from "@fortawesome/fontawesome";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function App() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: ''
  });
  const [signupFormData, setSignupFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  console.log("after coming from register button from home page, isSignUpActive=",isSignUpActive);
  
  const { email: loginEmail, password: loginPassword } = loginFormData;
  const { username, email: signupEmail, password: signupPassword } = signupFormData;

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
    window.history.pushState({}, null, '/register');
  };


  const onLoginChange = (e) =>
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });

  const onSignupChange = (e) =>
    setSignupFormData({ ...signupFormData, [e.target.name]: e.target.value });

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("formData=",loginFormData);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginFormData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Login successful!');
        console.log(data.token);
      } else {
        console.error('Login error:', response.statusText);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const onSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupFormData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Registration successful!');
        console.log(data.token);
      } else {
        console.error('Registration error:', response.statusText);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
    window.history.pushState({}, null, '/login');
  };

  return (
    <div className={`container ${isSignUpActive ? "right-panel-active" : ""}`}>
      <ToastContainer/>
      <div className="form-container sign-up-container">
        <form onSubmit={onSignupSubmit} >
          <h1>Create Account</h1>
          <div className="social-container">
            <a target="_blank" href="http://www.facebook.com" className="social">
            <img width="45" height="45" src="https://img.icons8.com/plasticine/100/facebook-new.png" alt="facebook-new"/>
            </a>
            <a target="_blank" href="http://localhost:5000/api/auth/google" className="social">
            <img width="45" height="45" src="https://img.icons8.com/plasticine/100/google-logo.png" alt="google-logo"/>
            </a>
            <a target="_blank" href="http://www.linkedin.com" className="social">
            <img width="45" height="45" src="https://img.icons8.com/plasticine/100/linkedin.png" alt="linkedin"/>
            </a>
          </div>

          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" value={username} name="username"
            onChange={onSignupChange}
            required />
          <input type="email" placeholder="Email" value={signupEmail} name="email"
            onChange={onSignupChange}
            required/>
          <input type="password" placeholder="Password" value={signupPassword} name="password"
            onChange={onSignupChange}
            required/>
          <button>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={onLoginSubmit}>
          <h1>Sign in</h1>
          <div className="social-container">
            <a target="_blank" href="http://www.facebook.com" className="social">
            <img width="45" height="45" src="https://img.icons8.com/plasticine/100/facebook-new.png" alt="facebook-new"/>
            </a>
            <a target="_blank" href="http://localhost:5000/auth/google" className="social">
            <img width="45" height="45" src="https://img.icons8.com/plasticine/100/google-logo.png" alt="google-logo"/>
            </a>
            <a target="_blank" href="http://www.linkedin.com" className="social">
            <img width="45" height="45" src="https://img.icons8.com/plasticine/100/linkedin.png" alt="linkedin"/>
            </a>
          </div>
          <span>or use your account</span>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={loginEmail}
            onChange={onLoginChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={loginPassword}
            onChange={onLoginChange}
            minLength="6"
            required
          />
          <a href="#">Forgot your password?</a>
          <button>Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button className="ghost" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
