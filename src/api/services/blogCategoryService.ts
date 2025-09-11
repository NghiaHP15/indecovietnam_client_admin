import apiClient from "../apiClient";

export enum BlogCategoryApi {
  internalBlogCategory = '/blog-category',
}

const internalBlogCategorys = async (data: any = {}) => await apiClient.get({ url: BlogCategoryApi.internalBlogCategory, params: data })
const createBlogCategory = async (data: any = {}) => await apiClient.post({ url: BlogCategoryApi.internalBlogCategory, data })
const updateBlogCategory = async (id: string, data: any = {}) => await apiClient.put({ url: `${BlogCategoryApi.internalBlogCategory}/${id}`, data: data})
const deleteBlogCategory = async (id: string) => await apiClient.delete({ url: `${BlogCategoryApi.internalBlogCategory}/${id}`})

export {
  internalBlogCategorys,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory
};
