import React from "react";
import TaskList from "../components/TaskList";
import TaskForm from './TaskForm'
import Navbar from "../components/Navbar";

const Dashboard = ({ token }) => {
  return (
    <div>
      <Navbar token={token} /> 
      <h1>Task Manager</h1>
      <TaskForm token={token} />
      <TaskList token={token} />
    </div>
  );
};

export default Dashboard;
