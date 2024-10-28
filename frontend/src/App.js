import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskList from "./components/TaskList";
// import AddTaskForm from "./components/AddTaskForm";
// import EditTaskForm from "./components/EditTaskForm";
import LoginForm from "./components/Auth/LoginForm"; // Import LoginForm component

function App() {
  // Custom hook to access route parameters
  const { page } = useParams();

  // Check if the current page is 'register'
  const isRegisterPage = page === 'register';

  return (
    <Router>
      <div className={`App ${isRegisterPage ? "register-page" : ""}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tasks" element={<TaskList />} />
          {/* <Route path="/add-task" element={<AddTaskForm />} /> */}
          {/* <Route path="/edit-task/:id" element={<EditTaskForm />} /> */}
        </Routes>
        {/* Render the LoginForm component only on the /register route */}
        {isRegisterPage && <LoginForm />}
      </div>
    </Router>
  );
}

export default App;
