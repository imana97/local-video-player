import { API_URL } from './config';

// Retrieve the token from local storage
const getToken = () => localStorage.getItem('token');

// Store the token in local storage
const setToken = (token: string) => localStorage.setItem('token', token);

// Remove the token from local storage
const clearToken = () => localStorage.removeItem('token');

// Register a new user
const register = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

// Log in an existing user
const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (response.ok) {
    setToken(data.token);
  }
  return data;
};

// Upload a video
const uploadVideo = async (videoFile: File, name: string, description: string, tags: string[]) => {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('name', name);
  formData.append('description', description);
  formData.append('tags', JSON.stringify(tags));

  const response = await fetch(`${API_URL}/videos/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return response.json();
};

// Get all videos uploaded by the user
const getUserVideos = async () => {
  const response = await fetch(`${API_URL}/videos/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

// Get videos by tag uploaded by the user
const getUserVideosByTag = async (tag: string) => {
  const response = await fetch(`${API_URL}/videos/tag/${tag}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.json();
};

export { register, login, uploadVideo, getUserVideos, getUserVideosByTag, clearToken };
