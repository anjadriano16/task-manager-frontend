import React, { useState } from "react";
import { createTask } from "../api";

const TaskForm = ({ token, users }) => {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState(""); // State for assigned user

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask({ title, completed: false, assigned_to: assignedTo }, token);
    setTitle("");
    setAssignedTo(""); // Reset selection after submission
  };

  const handleChange = (e) => {
    setAssignedTo(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select name="assigned_to" value={assignedTo} onChange={handleChange}>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
