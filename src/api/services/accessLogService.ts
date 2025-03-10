import apiClient from '../apiClient';
import { IUserGroup } from '#/entity.ts';

export interface UserGroupReq extends IUserGroup {
  username: string;
  password: string;
}

export enum AccessLogApi {
  url = 'access-logs',
  activity = 'activity-history'
}


const search = (data: any) =>
  apiClient.get<UserGroupReq[]>({
    url: `${AccessLogApi.url}?page=${data.number}&size=${data.size}`,
    data,
  });
const searchPage = (data: any) =>
  apiClient.post<UserGroupReq[]>({
    url: `${AccessLogApi.activity}/search?page=${data.page}&size=${data.size}`, data,
  });
const logOut = () =>
  apiClient.get<UserGroupReq[]>({
    url: `${AccessLogApi.url}/log-logout`,
  });
export default {
  search,
  searchPage,
  logOut,
};
