import axios from "axios";

const API_URL = "https://task-manager-api-e3g2.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
});

export const login = (email, password) => api.post("/login", { email, password });
export const signup = (email, password) => api.post("/users", { user: { email, password } });
export const fetchTasks = (token) => api.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
export const createTask = (task, token) => api.post("/tasks", task, { headers: { Authorization: `Bearer ${token}` } });
export const updateTask = (id, updates, token) => api.put(`/tasks/${id}`, updates, { headers: { Authorization: `Bearer ${token}` } });
export const deleteTask = (id, token) => api.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
