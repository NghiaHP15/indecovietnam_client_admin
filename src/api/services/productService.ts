import apiClient from "../apiClient";

export enum ProductApi {
  internalProducts = '/internal/product',
  internalSupplierproduct = "/internal/supplierproduct",
  syncProducts = "/internal/product/sync"


}

const internalProducts = async (data: any = {}) => await apiClient.get({ url: ProductApi.internalProducts, params: data })
const internalSupplierproduct = async (data: any = "") => await apiClient.get({ url: `${ProductApi.internalSupplierproduct}/${data}`})
const syncProducts = async () => await apiClient.get({ url: ProductApi.syncProducts})
export default {
  internalProducts,
  internalSupplierproduct,
  syncProducts
};
