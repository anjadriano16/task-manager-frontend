import ActionCable from "@rails/actioncable";

const API_URL = "ws://localhost:3000/cable"; // Adjust for production

export const cable = ActionCable.createConsumer(API_URL);
