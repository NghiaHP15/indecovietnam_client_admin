import apiClient from "../apiClient";

export enum CustomerApi {
  internalCustomer = '/customer',
}

const internalCustomers = async (data: any = {}) => await apiClient.get({ url: CustomerApi.internalCustomer, params: data })
const createCustomer = async (data: any = {}) => await apiClient.post({ url: CustomerApi.internalCustomer, data })
const updateCustomer = async (id: string, data: any = {}) => await apiClient.put({ url: `${CustomerApi.internalCustomer}/${id}`, data: data})
const deleteCustomer = async (id: string) => await apiClient.delete({ url: `${CustomerApi.internalCustomer}/${id}`})

export {
  internalCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
