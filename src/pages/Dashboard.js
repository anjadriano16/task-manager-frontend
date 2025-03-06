import React from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../pages/TaskForm";

const Dashboard = ({ token }) => {
  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm token={token} />
      <TaskList token={token} />
    </div>
  );
};

export default Dashboard;
