import apiClient from "../apiClient";

export enum PolicyApi {
  internalPolicy = '/policy',
}

const intenalPolicies = async (data: any = {}) => await apiClient.get({ url: PolicyApi.internalPolicy, params: data })
const createPolicy = async (data: any = {}) => await apiClient.post({ url: PolicyApi.internalPolicy, data })
const updatePolicy = async (id: string, data: any = {}) => await apiClient.put({ url: `${PolicyApi.internalPolicy}/${id}`, data: data})
const deletePolicy = async (id: string) => await apiClient.delete({ url: `${PolicyApi.internalPolicy}/${id}`})

export {
  intenalPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy
};
