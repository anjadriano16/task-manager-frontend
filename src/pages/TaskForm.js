import React, { useState } from "react";
import { createTask } from "../api";

const TaskForm = ({ token }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask({ title, completed: false }, token);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <select name="assigned_to" value={task.assigned_to} onChange={handleChange}>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;

