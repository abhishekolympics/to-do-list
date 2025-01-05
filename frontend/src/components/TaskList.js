import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import TaskBox from "./TaskBox";
import "./TaskList.css";
import EditTaskModal from "./EditTaskModal";
import AddTaskModal from "./AddTaskModal";

const TaskList = () => {
  const [userdata, setUserdata] = useState({});
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const getUser = async () => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/login/success`,
        {
          withCredentials: true,
        }
      );
      setUserdata(response.data.user);
    } catch (error) {
      toast.error("Failed to fetch user data");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          withCredentials: true,
        }
      );
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const logout = () => {
    window.open(
      `${process.env.REACT_APP_BACKEND_URL}/logout`,
      "_self"
    );
  };

  const createTask = async (firstTaskTitle, firstTaskDescription) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          title: firstTaskTitle,
          user: userdata._id,
          description: firstTaskDescription,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        toast.success("New task created successfully.");
        fetchTasks();
        setShowPopup(false);
        setNewTaskTitle("");
        setNewTaskDescription("");
      }
    } catch (error) {
      toast.error("Failed to create new task.");
    }
  };

  const editTask = async (taskId, newTitle, newDescription) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}`,
        {
          title: newTitle,
          description: newDescription ? newDescription : "",
          taskId: selectedTask,
          userId: userdata._id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Task updated successfully.");
        await fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Task deleted successfully.");
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userdata._id) {
      fetchTasks();
    }
  }, [userdata]);

  return (
    <>
      <Navbar
        username={userdata.username}
        onLogout={logout}
        onCreateTask={() => setShowPopup(true)}
      />
      <div className="task-list-container">
        <div className="task-container">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskBox
                key={task._id}
                task={task}
                onEdit={handleEditClick}
                onDelete={deleteTask}
              />
            ))
          ) : (
            <p>No tasks found. Create a new task to get started!</p>
          )}
        </div>
        {showPopup && (
          <AddTaskModal
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            onSave={createTask}
          />
        )}
        {isEditModalOpen &&
          selectedTask && (
            <EditTaskModal
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              onSave={editTask}
              task={selectedTask}
            />
          )}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </div>
    </>
  );
};

export default TaskList;
