import apiClient from '../apiClient';
import { IUserGroup } from '#/entity.ts';

export interface UserGroupReq extends IUserGroup {
  username: string;
  password: string;
}

export enum UserGroupApi {
  url = 'users-group'
}

const findById = (id: string) =>
  apiClient.get<UserGroupReq[]>({ url: `${UserGroupApi.url}/${id}` });
const search = (data: any) =>
  apiClient.get<UserGroupReq[]>({ url: `${UserGroupApi.url}`, params: data });
const update = (id: number, data: any) =>
  apiClient.put<UserGroupReq[]>({
    url: `${UserGroupApi.url}?id=${id}`,
    data,
  });
const create = (data: UserGroupReq) =>
  apiClient.post<UserGroupReq[]>({
    url: `${UserGroupApi.url}`,
    data,
  });
const changeState = (id: string) =>
  apiClient.post<UserGroupReq[]>({
    url: `${UserGroupApi.url}/change-state/${id}`,
  });
const checkLog = (id: string) =>
  apiClient.get<UserGroupReq[]>({
    url: `${UserGroupApi.url}/check-lock/${id}`,
  });
const deleteUserGroup = (id: string) =>
  apiClient.delete<UserGroupReq[]>({
    url: `${UserGroupApi.url}/${id}`,
  });
const searchPage = (data: any) =>
  apiClient.post<UserGroupReq[]>({
    url: `${UserGroupApi.url}/search`, params: data,
  });
const other = (id: any) =>
  apiClient.get<UserGroupReq[]>({
    url: `${UserGroupApi.url}/other/${id}`,
  });
export default {
  findById,
  search,
  update,
  create,
  changeState,
  other,
  deleteUserGroup,
  searchPage,
  checkLog,
};
