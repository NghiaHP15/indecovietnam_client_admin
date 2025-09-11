import apiClient from "../apiClient";

export enum ProductVariantApi {
  internalProductVariants = '/product-variant',
}

const internalProductVariants = async (data: any = {}) => await apiClient.get({ url: ProductVariantApi.internalProductVariants, params: data });
const createProductVariant = async (data: any = {}) => await apiClient.post({ url: ProductVariantApi.internalProductVariants, data });
const updateProductVariant = async (id: string, data: any = {}) => await apiClient.put({ url: `${ProductVariantApi.internalProductVariants}/${id}`, data: data});
const deleteProductVariant = async (id: string) => await apiClient.delete({ url: `${ProductVariantApi.internalProductVariants}/${id}`});

export {
  internalProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant
};
