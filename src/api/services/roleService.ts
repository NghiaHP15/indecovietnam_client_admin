import apiClient from "../apiClient";

export enum RoleApi {
  internalRole = '/internal/role',
}

const internalRoles = async (data: any = {}) => await apiClient.get({ url: RoleApi.internalRole, params: data })
const createUpdate = async (data: any = {}) => await apiClient.post({ url: RoleApi.internalRole, data })
const updateRole = async (id: string, data: any = {}) => await apiClient.put({ url: `${RoleApi.internalRole}/${id}`, data: data})
const deleteRole = async (id: string) => await apiClient.delete({ url: `${RoleApi.internalRole}/${id}`})

export default {
  internalRoles,
  createUpdate,
  updateRole,
  deleteRole
};
