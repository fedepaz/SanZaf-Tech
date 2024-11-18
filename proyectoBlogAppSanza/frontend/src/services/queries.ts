import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
export const fetchAuthStatus = () => api.get("/auth/status");
export const logout = () => api.post("/auth/logout");
export const createPost = (title: string, content: string) =>
  api.post("/posts", { title, content });
export const fetchPosts = () => api.get("/posts");
export const deletePost = (postId: string) => api.delete(`/posts/${postId}`);
export const updatePost = (postId: string, title: string, content: string) =>
  api.put(`/posts/${postId}`, { title, content });
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });
export const register = (username: string, email: string, password: string) =>
  api.post("/auth/register", { username, email, password });
