import apiClient from "../apiClient";

export enum GalleryApi {
  internalGallery = '/gallery',
}

const internalGallerys = async (data: any = {}) => await apiClient.get({ url: GalleryApi.internalGallery, params: data })
const createGallery = async (data: any = {}) => await apiClient.post({ url: GalleryApi.internalGallery, data })
const updateGallery = async (id: string, data: any = {}) => await apiClient.put({ url: `${GalleryApi.internalGallery}/${id}`, data: data})
const deleteGallery = async (id: string) => await apiClient.delete({ url: `${GalleryApi.internalGallery}/${id}`})

export {
  internalGallerys,
  createGallery,
  updateGallery,
  deleteGallery
};
