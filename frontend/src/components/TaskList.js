import React, { useEffect } from 'react';
import TaskItem from './TaskItem';
import useTask from '../hooks/useTask';

const TaskList = () => {
  const { tasks, getAllTasks } = useTask();

  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  return (
    <div>
      <h2>Task List</h2>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
