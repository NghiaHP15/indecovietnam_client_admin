import { CategorySupplier } from '#/entity';
import apiClient from '../apiClient';

export enum CategorySupplierApi {
  CategorySupplier = '/internal/suppliercategory',
}

const getCategorySupplier = (data: any = {}) => apiClient.get({url:CategorySupplierApi.CategorySupplier, params: data});
const createCategorySupplier = (data: CategorySupplier ) => apiClient.post({url:CategorySupplierApi.CategorySupplier,data: data});
const updateCategorySupplier = (id: string, data: any) => apiClient.put({url:`${CategorySupplierApi.CategorySupplier}/${id}`,data: data});
const deleteCategorySupplier = (id : string) => apiClient.delete({url:`${CategorySupplierApi.CategorySupplier}/${id}`});

export default {
  getCategorySupplier,
  createCategorySupplier,
  updateCategorySupplier,
  deleteCategorySupplier,
};
