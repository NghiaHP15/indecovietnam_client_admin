import apiClient from "../apiClient";

export enum UploadApi {
  upload = '/upload/image',
}

const uploadImage = async (data: FormData) => await apiClient.post({ url: UploadApi.upload, data, headers: { "Content-Type": "multipart/form-data"} });
const deleteImage = async (id: string) => await apiClient.delete({ url: UploadApi.upload, params: { publicId: id } });

export {
  uploadImage,
  deleteImage
};
