import apiClient from "../apiClient";

export enum ColorApi {
  internalColor = '/color',
}

const internalColors = async (data: any = {}) => await apiClient.get({ url: ColorApi.internalColor, params: data })
const createColor = async (data: any = {}) => await apiClient.post({ url: ColorApi.internalColor, data })
const updateColor = async (id: string, data: any = {}) => await apiClient.put({ url: `${ColorApi.internalColor}/${id}`, data: data})
const deleteColor = async (id: string) => await apiClient.delete({ url: `${ColorApi.internalColor}/${id}`})

export {
  internalColors,
  createColor,
  updateColor,
  deleteColor
};
