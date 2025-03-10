import { useEffect } from "react";
import { createConsumer } from "@rails/actioncable";

const useTaskUpdates = (onUpdate, onDelete) => {
  useEffect(() => {
    const cable = createConsumer("ws://localhost:3000/cable"); 
    const subscription = cable.subscriptions.create("TaskUpdatesChannel", {
      received: (task) => {
        if (task.deleted) {
          onDelete(task.id);
        } else {
          onUpdate(task);
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate, onDelete]);

  return null; // Ensure the hook returns something valid
};

export default useTaskUpdates;
