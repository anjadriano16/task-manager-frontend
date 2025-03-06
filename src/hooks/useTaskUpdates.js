import { useEffect } from "react";
import actionCable from "@rails/actioncable";

const useTaskUpdates = (onUpdate) => {
  useEffect(() => {
    const cable = actionCable.createConsumer("ws://localhost:3000/cable");
    const subscription = cable.subscriptions.create("TaskUpdatesChannel", {
      received: (task) => onUpdate(task),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate]);
};

export default useTaskUpdates;
