import React, { useEffect, useState } from "react";
import { fetchTasks, updateTask, deleteTask } from "../api";
import { cable } from "../socket";
import useTaskUpdates from "../hooks/useTaskUpdates";

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // Track task to delete
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTasks(token).then((response) => setTasks(response.data));

    const subscription = cable.subscriptions.create("TaskChannel", {
      received: (data) => {
        if (data.action === "created") {
          setTasks((prev) => [...prev, data.task]);
        } else if (data.action === "updated") {
          setTasks((prev) =>
            prev.map((task) => (task.id === data.task.id ? data.task : task))
          );
        } else if (data.action === "deleted") {
          setTasks((prev) => prev.filter((task) => task.id !== data.task.id));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [token]);

  useTaskUpdates(
    (updatedTask) => {
      setTasks((prevTasks) => {
        const existingTask = prevTasks.find((t) => t.id === updatedTask.id);
        if (existingTask) {
          setNotification(`"${updatedTask.title}" was updated.`);
          return prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
        } else {
          setNotification(`"${updatedTask.title}" was created.`);
          return [...prevTasks, updatedTask];
        }
      });
      setTimeout(() => setNotification(null), 3000);
    },
    (deletedTaskId) => {
      const deletedTask = tasks.find((task) => task.id === deletedTaskId);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== deletedTaskId));
      if (deletedTask) {
        setNotification(`"${deletedTask.title}" was deleted.`);
        setTimeout(() => setNotification(null), 3000);
      }
    }
  );

  // Function to confirm deletion
  const handleDelete = (taskId) => {
    setConfirmDelete(taskId);
  };

  // Function to proceed with deletion
  const confirmDeleteTask = async () => {
    if (confirmDelete) {
      await deleteTask(confirmDelete, token); // Call API to delete task
      setConfirmDelete(null);
    }
  };

  // Filter tasks based on category, due date, and search term
  const filteredTasks = tasks.filter((task) => {
    return (
      (filterCategory ? task.category === filterCategory : true) &&
      (filterDate ? task.due_date === filterDate : true) &&
      (searchTerm ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Tasks</h2>
      {notification && <div className="notification">{notification}</div>}

      {/* Filter and Search Controls */}
      <div className="filters">
        <select onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
        </select>
        <input type="date" onChange={(e) => setFilterDate(e.target.value)} />
        <input
          type="text"
          placeholder="Search tasks..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li key={task.id} className="p-3 border rounded-md flex justify-between items-center">
            <span>{task.title} - {task.completed ? "✅" : "❌"}</span>
            <div>
              <button
                className="px-2 py-1 bg-yellow-400 text-white rounded-md mr-2"
                onClick={() => updateTask(task.id, { completed: !task.completed }, token)}
              >
                Toggle
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-md"
                onClick={() => deleteTask(task.id, token)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Confirmation Popup */}
      {confirmDelete && (
        <div className="popup">
          <p>Are you sure you want to delete this task?</p>
          <button onClick={confirmDeleteTask}>Yes, Delete</button>
          <button onClick={() => setConfirmDelete(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
