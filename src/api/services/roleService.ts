import apiClient from "../apiClient";

export enum RoleApi {
  internalRole = '/role',
}

const internalRoles = async (data: any = {}) => await apiClient.get({ url: RoleApi.internalRole, params: data })
const createRole = async (data: any = {}) => await apiClient.post({ url: RoleApi.internalRole, data })
const updateRole = async (id: string, data: any = {}) => await apiClient.put({ url: `${RoleApi.internalRole}/${id}`, data: data})
const deleteRole = async (id: string) => await apiClient.delete({ url: `${RoleApi.internalRole}/${id}`})

export {
  internalRoles,
  createRole,
  updateRole,
  deleteRole
};
