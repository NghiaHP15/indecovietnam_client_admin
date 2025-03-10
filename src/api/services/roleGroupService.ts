import apiClient from '../apiClient';
// eslint-disable-next-line import/extensions
import { IUserGroup } from '#/entity.ts';
import { UserGroupReq } from '@/api/services/userGroupService.ts';

export interface RoleGroupReq extends IUserGroup {
  username: string;
  password: string;
}

export enum UserGroupApi {
  url = 'decentralization-group',
  urlMenu = 'function',
  urlRole = 'decentralization',
}

const findById = (id: string) =>
  apiClient.get<RoleGroupReq[]>({ url: `${UserGroupApi.url}/${id}` });
const search = (data: any) =>
  apiClient.get<RoleGroupReq[]>({ url: `${UserGroupApi.url}`, params: data });
const update = (id: number, data: any) =>
  apiClient.put<RoleGroupReq[]>({
    url: `${UserGroupApi.url}?id=${id}`,
    data,
  });
const create = (data: RoleGroupReq) =>
  apiClient.post<RoleGroupReq[]>({
    url: `${UserGroupApi.url}`,
    data,
  });
const changeState = (id: string) =>
  apiClient.post<RoleGroupReq[]>({
    url: `${UserGroupApi.url}/change-state/${id}`,
  });
const deleteItem = (id: string) =>
  apiClient.delete<RoleGroupReq[]>({
    url: `${UserGroupApi.url}/${id}`,
  });
const searchMenu = (data: any) =>
  apiClient.get<RoleGroupReq[]>({ url: `${UserGroupApi.urlMenu}`, params: data });
const searchRole = (data: any) =>
  apiClient.get<RoleGroupReq[]>({ url: `${UserGroupApi.urlRole}`, params: data });
const changeRole = (data: any) =>
  apiClient.put<RoleGroupReq[]>({ url: `${UserGroupApi.urlRole}`, data });
const searchPage = (data: any) =>
  apiClient.post<UserGroupReq[]>({
    url: `${UserGroupApi.url}/search`, params: data,
  });
export default {
  findById,
  search,
  update,
  create,
  changeState,
  deleteItem,
  searchMenu,
  searchRole,
  changeRole,
  searchPage,
};
