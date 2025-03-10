import React, { useEffect, useState } from "react";
import { fetchTasks } from "../api";

const Notifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchTasks(token).then(({ data }) => {
      const dueTasks = data.filter(task => {
        const dueDate = new Date(task.due_date);
        return !task.completed && dueDate < new Date(Date.now() + 24 * 60 * 60 * 1000);
      });
      setNotifications(dueTasks);
    });
  }, [token]);

  return (
    <div>
      {notifications.length > 0 && (
        <div className="notification">
          <p>You have {notifications.length} tasks due soon!</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
