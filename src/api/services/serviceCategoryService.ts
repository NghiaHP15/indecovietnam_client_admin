import apiClient from "../apiClient";

export enum ServiceCategoryApi {
  internalServiceCategory = '/service-category',
}

const internalServiceCategorys = async (data: any = {}) => await apiClient.get({ url: ServiceCategoryApi.internalServiceCategory, params: data })
const createServiceCategory = async (data: any = {}) => await apiClient.post({ url: ServiceCategoryApi.internalServiceCategory, data })
const updateServiceCategory = async (id: string, data: any = {}) => await apiClient.put({ url: `${ServiceCategoryApi.internalServiceCategory}/${id}`, data: data})
const deleteServiceCategory = async (id: string) => await apiClient.delete({ url: `${ServiceCategoryApi.internalServiceCategory}/${id}`})

export {
  internalServiceCategorys,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory
};
