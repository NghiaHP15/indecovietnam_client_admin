import apiClient from "../apiClient";

export enum ProductCategoryApi {
  internalProductCategory = '/product-category',
}

const internalProductCategorys = async (data: any = {}) => await apiClient.get({ url: ProductCategoryApi.internalProductCategory, params: data })
const createProductCategory = async (data: any = {}) => await apiClient.post({ url: ProductCategoryApi.internalProductCategory, data })
const updateProductCategory = async (id: string, data: any = {}) => await apiClient.put({ url: `${ProductCategoryApi.internalProductCategory}/${id}`, data: data})
const deleteProductCategory = async (id: string) => await apiClient.delete({ url: `${ProductCategoryApi.internalProductCategory}/${id}`})

export {
  internalProductCategorys,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
};
