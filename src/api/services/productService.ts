import apiClient from "../apiClient";

export enum ProductApi {
  internalProducts = '/product',
}

const internalProducts = async (data: any = {}) => await apiClient.get({ url: ProductApi.internalProducts, params: data });
const createProduct = async (data: any = {}) => await apiClient.post({ url: ProductApi.internalProducts, data });
const updateProduct = async (id: string, data: any = {}) => await apiClient.put({ url: `${ProductApi.internalProducts}/${id}`, data: data});
const deleteProduct = async (id: string) => await apiClient.delete({ url: `${ProductApi.internalProducts}/${id}`});

export {
  internalProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
