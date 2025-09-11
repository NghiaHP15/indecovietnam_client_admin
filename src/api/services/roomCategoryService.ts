import apiClient from "../apiClient";

export enum RoomCategoryApi {
  internalRoomCategory = '/room-category',
}

const internalRoomCategorys = async (data: any = {}) => await apiClient.get({ url: RoomCategoryApi.internalRoomCategory, params: data })
const createRoomCategory = async (data: any = {}) => await apiClient.post({ url: RoomCategoryApi.internalRoomCategory, data })
const updateRoomCategory = async (id: string, data: any = {}) => await apiClient.put({ url: `${RoomCategoryApi.internalRoomCategory}/${id}`, data: data})
const deleteRoomCategory = async (id: string) => await apiClient.delete({ url: `${RoomCategoryApi.internalRoomCategory}/${id}`})

export {
  internalRoomCategorys,
  createRoomCategory,
  updateRoomCategory,
  deleteRoomCategory
};
