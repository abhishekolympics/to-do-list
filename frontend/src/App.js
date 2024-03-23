import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import EditTaskForm from "./components/EditTaskForm";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider> {/* Ensure AuthProvider wraps your entire app */}
          <TaskProvider> {/* TaskProvider can also be placed here if needed */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/add-task" element={<AddTaskForm />} />
              <Route path="/edit-task/:id" element={<EditTaskForm />} />
            </Routes>
          </TaskProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
