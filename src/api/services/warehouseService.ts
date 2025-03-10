import { Warehouse } from '#/entity';
import apiClient from '../apiClient';
interface UpdateWarehouse {
  id: string,
  data: Warehouse
}

export enum WarehouseApi {
  WareHouse = '/internal/warehouse',
  WarehouseStorage= '/internal/warehousestorage'
}

const getWarehouse = (data: any = {}) => apiClient.get({url:WarehouseApi.WareHouse, params: data});
const getWarehouseDetail = (id : string) => apiClient.get({url:`${WarehouseApi.WareHouse}/${id}`});
const createWarehouse = (data: Warehouse ) => apiClient.post({url:WarehouseApi.WareHouse,data: data});
const updateWarehouse = ({id, data}: UpdateWarehouse) => apiClient.put({url:`${WarehouseApi.WareHouse}/${id}`,data: data});
const deleteWarehouse = (id : string) => apiClient.delete({url:`${WarehouseApi.WareHouse}/${id}`});
const warehousestorage = (id: string, data: any = {}) => apiClient.get({ url: `${WarehouseApi.WarehouseStorage}/${id}`, params: data})

export default {
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseDetail,
  warehousestorage
}
