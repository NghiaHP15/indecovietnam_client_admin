import { Supplier } from '#/entity';
import apiClient from '../apiClient';
interface UpdateSupplierRq {
  id: string,
  data: Supplier
}

export enum SupplierApi {
  Supplier = '/internal/supplier',
  ImportSupplier= '/internal/supplier/import'
}

const getSupplier = (data: any) => apiClient.get({url:SupplierApi.Supplier, params: data});
const createSupplier = (data: Supplier ) => apiClient.post({url:SupplierApi.Supplier,data: data});
const updateSupplier = ({id, data}: UpdateSupplierRq) => apiClient.put({url:`${SupplierApi.Supplier}/${id}`,data: data});
const deleteSupplier = (id : string) => apiClient.delete({url:`${SupplierApi.Supplier}/${id}`});
const importExcel = (data: Supplier[]) => apiClient.post({url:SupplierApi.ImportSupplier, data: data})

export default {
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  importExcel
};
