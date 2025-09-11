import apiClient from "../apiClient";

export enum AddressApi {
  internalAddress = '/address',
}

const internalAddresss = async (data: any = {}) => await apiClient.get({ url: AddressApi.internalAddress, params: data })
const createAddress = async (data: any = {}) => await apiClient.post({ url: AddressApi.internalAddress, data })
const updateAddress = async (id: string, data: any = {}) => await apiClient.put({ url: `${AddressApi.internalAddress}/${id}`, data: data})
const deleteAddress = async (id: string) => await apiClient.delete({ url: `${AddressApi.internalAddress}/${id}`})

export {
  internalAddresss,
  createAddress,
  updateAddress,
  deleteAddress
};
