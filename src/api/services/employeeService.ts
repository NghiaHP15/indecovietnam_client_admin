import apiClient from "../apiClient";

export enum EmployeeApi {
  internalEmployee = '/employee',
}

const internalEmployees = async (data: any = {}) => await apiClient.get({ url: EmployeeApi.internalEmployee, params: data })
const createEmployee = async (data: any = {}) => await apiClient.post({ url: EmployeeApi.internalEmployee, data })
const updateEmployee = async (id: string, data: any = {}) => await apiClient.put({ url: `${EmployeeApi.internalEmployee}/${id}`, data: data})
const deleteEmployee = async (id: string) => await apiClient.delete({ url: `${EmployeeApi.internalEmployee}/${id}`})

export {
  internalEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
