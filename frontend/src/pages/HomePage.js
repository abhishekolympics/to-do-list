import React from 'react';
import { Link } from 'react-router-dom';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const HomePage = () => {

  return (
    <div>
      <h1>Welcome to My Todo List App</h1>
        <div>
          <p>This is the home page of our Todo List application.</p>
          <p>You can click the buttons below to navigate:</p>
           <Link to="/login"><button>Login</button></Link>
          <Link to="/register"><button>Register</button></Link>
        </div> 
    </div>
  );
};

export default HomePage;
