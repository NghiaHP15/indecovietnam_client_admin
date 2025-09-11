import apiClient from "../apiClient";

export enum MenuApi {
  internalMenu = '/menu',
}

const internalMenus = async (data: any = {}) => await apiClient.get({ url: MenuApi.internalMenu, params: data })
const createMenu = async (data: any = {}) => await apiClient.post({ url: MenuApi.internalMenu, data })
const updateMenu = async (id: string, data: any = {}) => await apiClient.put({ url: `${MenuApi.internalMenu}/${id}`, data: data})
const deleteMenu = async (id: string) => await apiClient.delete({ url: `${MenuApi.internalMenu}/${id}`})

export {
  internalMenus,
  createMenu,
  updateMenu,
  deleteMenu
};
