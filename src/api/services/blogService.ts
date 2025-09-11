import apiClient from "../apiClient";

export enum BlogApi {
  internalBlog = '/blog',
}

const internalBlogs = async (data: any = {}) => await apiClient.get({ url: BlogApi.internalBlog, params: data })
const createBlog = async (data: any = {}) => await apiClient.post({ url: BlogApi.internalBlog, data })
const updateBlog = async (id: string, data: any = {}) => await apiClient.put({ url: `${BlogApi.internalBlog}/${id}`, data: data})
const deleteBlog = async (id: string) => await apiClient.delete({ url: `${BlogApi.internalBlog}/${id}`})

export {
  internalBlogs,
  createBlog,
  updateBlog,
  deleteBlog
};
