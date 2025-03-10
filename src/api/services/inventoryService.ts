import { Inventory } from "#/entity";
import apiClient from "../apiClient";

export enum InventoryApi {
  inventoryUrl = '/internal/inventorysheet',
  inventorydetailUrl = '/internal/inventorysheetdetail'
}

const internalInventory = async (data: any = {}) => await apiClient.get({ url: InventoryApi.inventoryUrl, params: data })
const addInventory = async (data: Inventory) => await apiClient.post({ url: InventoryApi.inventoryUrl, data: data })
const deleteInventory = async (id: string) => await apiClient.delete({ url: `${InventoryApi.inventoryUrl}/${id}`})
const updateInventory = async (id: string, data: any = {}) => await apiClient.put({ url: `${InventoryApi.inventoryUrl}/${id}`, data: data})
const getDetailInventory  = async (id: string) => await apiClient.get({ url: `${InventoryApi.inventorydetailUrl}/${id}`})
const updateStatus = async (data: Inventory) => await apiClient.put({ url: `${InventoryApi.inventoryUrl}/${data.id}/${data.status}` })

export default {
  internalInventory,
  addInventory,
  deleteInventory,
  getDetailInventory,
  updateInventory,
  updateStatus
};
