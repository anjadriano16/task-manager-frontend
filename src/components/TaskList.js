import React, { useEffect, useState } from "react";
import { fetchTasks, updateTask, deleteTask } from "../api";
import { cable } from "../socket";

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);

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
      },
    });

    return () => subscription.unsubscribe();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
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
    </div>
  );
};

export default TaskList;
