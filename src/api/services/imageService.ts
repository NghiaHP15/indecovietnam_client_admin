import apiClient from "../apiClient";

export enum ImageApi {
  internalImage = '/upload/image',
}

const internalImages = async (data: any = {}) => await apiClient.get({ url: ImageApi.internalImage, params: data });
const deleteImage = async (id: string) => await apiClient.delete({ url: `${ImageApi.internalImage}/${id}`})
const deleteImages = async (data: string[]) => await apiClient.delete({ url: `${ImageApi.internalImage}/delete-multi`, data });

export {
  internalImages,
  deleteImage,
  deleteImages
};
