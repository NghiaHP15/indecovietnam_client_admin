import apiClient from '../apiClient';

export enum ReceiptApi {
  Receipt = '/internal/receipt',
}

const getReceipt = (data: any) => apiClient.get({ url: ReceiptApi.Receipt, params: data });
const getReceiptDetail = (id: string) => apiClient.get({ url: `${ReceiptApi.Receipt}/${id}` });
const createReceipt = (data: any) => apiClient.post({ url: ReceiptApi.Receipt, data: data });

export default {
  getReceipt,
  createReceipt,
  getReceiptDetail
};
