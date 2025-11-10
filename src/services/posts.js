import api from '../config/AxiosConfig';

export async function getPosts(skip = 0, limit = 20) {
  const res = await api.doGet(`/posts?skip=${skip}&limit=${limit}`);
  return res.data;
}

export async function getPostById(postId) {
  const res = await api.doGet(`/posts/${postId}`);
  return res.data;
}

export async function createPost(data) {
  const res = await api.doPost('/posts/', data);
  return res.data;
}

export async function updatePost(postId, data) {
  const res = await api.doPut(`/posts/${postId}`, data);
  return res.data;
}

export async function softDeletePost(postId) {
  await api.doDelete(`/posts/${postId}`);
}

export async function hardDeletePost(postId) {
  await api.doDelete(`/posts/${postId}/hard`);
}

export async function getPostsByFurniture(furnitureId, skip = 0, limit = 20) {
  const res = await api.doGet(`/posts/furniture/${furnitureId}?skip=${skip}&limit=${limit}`);
  return res.data;
}
