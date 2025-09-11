import apiClient from "../apiClient";

export enum OrderApi {
  internalOrder = '/order',
}

const internalOrders = async (data: any = {}) => await apiClient.get({ url: OrderApi.internalOrder, params: data })
const getOrder = async (id: string) => await apiClient.get({ url: `${OrderApi.internalOrder}/${id}` })
const createOrder = async (data: any = {}) => await apiClient.post({ url: OrderApi.internalOrder, data })
const updateOrder = async (id: string, data: any = {}) => await apiClient.put({ url: `${OrderApi.internalOrder}/update/${id}`, data: data})
const deleteOrder = async (id: string) => await apiClient.delete({ url: `${OrderApi.internalOrder}/cancel/${id}`})

export {
  internalOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder
};
