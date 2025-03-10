import apiClient from '../apiClient';
import { User, UserInfo } from '#/entity';

export interface SignInReq {
  username: string;
  password: string;
}

export interface SignUpReq extends SignInReq {
  email: string;
}

export type SignInRes = { user: UserInfo };

export interface SignInResponse {
  resid: string;
  _id: string;
  username: string;
  type: string;
  resRole: {
    type: string;
    uid: string;
    permissionId: string;
  }[];
}

export interface SignInInput {
  username: string;
  password: string;
  resId: string;
}


export interface LoginUserInput {
  userName: string;
  password: string;
  vendorId?: string
}

export interface LoginRequest {
  userName?: string;
  password?: string;
  vendorId?: string;
  role?: string;
  refRole?: string,
  uid?:string,
  type?: string
}

export interface LoginResponse{
  token: string,
  user: LoginRequest
}

export enum UserApi {
  SignIn = '/internal/auth/login',
  AutoLogin ='internal/auth/auto-login',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/internal/user',
  update = '/info',
}

const signin = (data: LoginRequest) => apiClient.post<LoginResponse>({url: UserApi.SignIn , data});
const autoLogin = (data: LoginRequest) => apiClient.post<LoginResponse>({url: UserApi.AutoLogin , data});
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (username: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${username}` });
const searchUser = (data: any) => apiClient.post<UserInfo[]>({
  url: `${UserApi.User}/search?page=${data.number || 0}&size=${data.size || 50}`,
  data,
});
const updateUser = (id: string, data: any) => apiClient.put({ url: `${UserApi.User}/${id}`, data});
const deleteUser = (id: string) => apiClient.delete({ url: `${UserApi.User}/${id}`});
const createUser = (data: User) => apiClient.post({ url: UserApi.User, data });
const updatePassWord = (data: UserInfo) =>
  apiClient.post<UserInfo[]>({
    url: `${UserApi.User}/update-password`,
    data,
  });
const changeState = (data: any) =>
  apiClient.post<UserInfo[]>({
    url: `${UserApi.User}/change-state`,
    data,
  });
const getRoleByUser = (data: any) => {
  return apiClient.get<UserInfo[]>({
    url: `${UserApi.User}/get-role-by-user`,
    data,
  });
}

const getAllUser = (data: any = {}) => apiClient.get({url: UserApi.User, data});



export default {
  signin,
  autoLogin,
  signup,
  findById,
  logout,
  searchUser,
  updateUser,
  deleteUser,
  createUser,
  updatePassWord,
  changeState,
  getRoleByUser,
  getAllUser,
  exportExcel: () => apiClient.get<UserInfo[]>({
    url: `${UserApi.User}/export/users`
  }),
  import: (data: any) => apiClient.post<any[]>({
    url: `${UserApi.User}/import`,
    data
  }),
  internalRole: () => apiClient.get<UserInfo[]>({
    url: `/internal/role`
  }),
  internalUserById: (id: string) => apiClient.get<UserInfo[]>({
    url: `/internal/user/${id}`
  }),
  
};
