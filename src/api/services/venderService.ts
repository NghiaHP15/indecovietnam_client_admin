import apiClient from "../apiClient";

export interface InternalRestaurantsInput {
  limit: number,
  page: number
}

export enum VerdorApi {
  internalVendors = '/internal/vendors',
  asyncVendors = '/internal/vendors/sync',
}

const internalVendors = async (data: any = {}) => await apiClient.get({ url: VerdorApi.internalVendors, params: data });
const asyncVendors = async () => await apiClient.get({ url: VerdorApi.asyncVendors });

export default {
  internalVendors,
  asyncVendors
};
