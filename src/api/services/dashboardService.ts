import apiClient from "../apiClient";

export enum DashBoardApi {
  getTotalOrder = '/dashboard/get-total-order',
  getSumOrder = '/dashboard/get-sum-order',
  getSumFeedback = '/dashboard/get-sum-feedback',
  getSumCustomer = '/dashboard/get-sum-customer',
  getTopCustomer = '/dashboard/get-top-customer',
  getNewOrder = '/dashboard/get-new-order',
  getTopProduct = '/dashboard/get-top-product',
  getOrderByMonth = '/dashboard/get-orders-by-month',
  test="",
}

const getTotalOrder = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.getTotalOrder, params: data })
const getSumOrder = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.getSumOrder, params: data })
const getSumFeedback = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.getSumFeedback, params: data })
const getSumCustomer = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.getSumCustomer, params: data })
const getTopCustomer = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.getTopCustomer, params: data })
const getNewOrder = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.getNewOrder, params: data })
const getOrderByMonth = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.getOrderByMonth, params: data })
const getTopProduct = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.getTopProduct, params: data })
const getTest = async (data: any = {}) => await apiClient.get({ url: DashBoardApi.test, params: data })


export {
  getTotalOrder,
  getSumOrder,
  getSumFeedback,
  getSumCustomer,
  getTopCustomer,
  getNewOrder,
  getOrderByMonth,
  getTopProduct,
  getTest
};
