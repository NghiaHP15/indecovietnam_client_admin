import apiClient from "../apiClient";

export enum ServiceApi {
  internalService = '/internal/service',
}

const internalService = async (data: any = {}) => await apiClient.get({ url: ServiceApi.internalService, params: data })
const createService = async (data: any = {}) => await apiClient.post({ url: ServiceApi.internalService, data })
const updateService = async (id: string, data: any = {}) => await apiClient.put({ url: `${ServiceApi.internalService}/${id}`, data: data})
const deleteService = async (id: string) => await apiClient.delete({ url: `${ServiceApi.internalService}/${id}`})

export default {
  internalService,
  createService,
  updateService,
  deleteService
};
