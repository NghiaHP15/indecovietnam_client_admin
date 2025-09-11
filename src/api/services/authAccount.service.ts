import apiClient from "../apiClient";

export interface LoginRequest {
  id?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export enum EmployeeApi {
  login = '/employee/login',
  resetPassword = '/employee/reset-password',
}

const loginEmpoloyee = async (data: any = {}) => await apiClient.post({ url: EmployeeApi.login, data })
const resetPassword = async (data: any = {}) => await apiClient.post({ url: EmployeeApi.resetPassword, data })

export {
  loginEmpoloyee,
  resetPassword
};
