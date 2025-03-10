import { Dayjs } from 'dayjs';
import { BasicStatus, PermissionType } from './enum';

export interface Mode {
  CREATE: String
  UPDATE: String
  VIEW: String
}

export interface Userinfo {
  id?: string;
  username?: string;
  fullname?: string,
  address?: string;
  refId?: string;
  refRole: string;
  vendorId: string;
}

export interface UserInfo {
  id?: string;
  userName?: string;
  fullName?: string | null;
  password?: string;
  isAdmin?: boolean;
  avatar?: string;
  role?: any;
  state?: BasicStatus;
  permissions?: any;
  group_user?: string;
  userGroupId?: string;
  confirmPassword?: string;
  menu?: string;
  menuFunc?: string;
  activityState?: boolean;
  orgId?: string
  birthDate?: string
  vendorId?: string
  refRole?: string
}

export interface Drive {
  id?: string;
  name?: string;
  idCard?: string;
  phone?: string;
  email?: string;
  address?: string;
  gender?: boolean;
  birthDate?: string;
  licenseType?: string;
  licenseNumber?: string;
  licensePlace?: string;
  licenseDate?: string;
  expiryDate?: string;
  groupName?: string;
  manager?: string;
  managerPhone?: string;
  licenseTypes?: string;
  experience?: string;
  status?: number;
  orgId?: string;
  orgName?: string;
  usernameTelegram?: string;
  userIdTelegram?: number;
}

export interface Product {
  id?: string,
  refId?: string,
  name?: string,
  nameNor?: string,
  image?: string,
  description?: string,
  price?: string
}

export interface IntermediatePoints {
  id?: string;
  tripHistoryId?: string;
  lat?: number,
  lng?: number,
  note?: string;
  name?: string;
  sort?: number;
}
export interface IntermediatePointsRequest extends IntermediatePoints {
  rowId?: string;
  editing?: boolean,
  value?: any
}

export interface DataTransmissionUnit {
  id: string; // Hoặc một kiểu dữ liệu khác phù hợp
  code: string;
  name: string;
  phone: string; // Số điện thoại
}

export interface Province {
  id: string;
  code?: string;
  name?: string;
  phone?: string;
}

export interface IConfigConnect {
  id: string;
  name?: string;
  value?: string;
  status?: BasicStatus;
  tax: string;
  address: string;
  email: string;
  phone: string;
  ip: string;
  secret?: string,
  clientId?: string
}

export interface IUserGroup {
  id: string;
  name?: string;
  state?: string;
  parentId: string;
  decentralizationGroupId: string;
  users?: UserInfo[];
  transportationId?: string;
}

export interface IRoleGroup {
  id: string;
  code: string,
  name?: string;
  parentId?: string;
  permission: any;
}

export interface INotification {
  id?: string | null;
  code?: string;
  name?: string;
  type?: number;
  notificationType?: number;
  conditionsName?: string;
  conditionsType?: string;
  conditionsValue?: string;
  areaType?:string;
  areaIds?:string[];
  channels?: number[];
  channelIds?: number[];
  groupId?: string;
  users ?: string[];
  userIds ?: string[];
  content?: string;
  frequency?: number;
  status?: number;
  state?: string;
  display?: string;
  receiverId?: string[];
  announcementDate?: string;
  createdAt?: string;
  title?:string;
  activity?:boolean
}

export interface IResponse {
  content?: any;
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  pageable?: {
    pageNumber: number,
    pageSize: number,
    sort: { empty: boolean, sorted: boolean, unsorted: boolean },
    offset: number,
  };
  page?: {
    number?: number;
    size: number;
    totalElements?: number;
    totalPages?: number;
  }
  size: number;
  sort?: { empty: true, sorted: false, unsorted: true };
  totalElements?: number;
  totalPages?: number;
}

export interface User {
  id: string,
  userName: string,
  fullName: string,
  address: string,
  refId: string,
  refRole: string,
  vendorId: string,
}

export interface Permission {
  id: string;
  parentId: string;
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  newFeature?: boolean;
  children?: Permission[];
}

export interface Role {
  id: string;
  vendorId: string;
  code: string;
  name: string;
  permission?: string | string[];
}

export interface Province {
  id: string;
  code?: string;
  name?: string;
}
export interface Option {
  id: any;
  name: string;
}

export interface ViewConfig {
  id?: string | null;
  orgId?: string | null;
  name?: string;
  url?: string;
  position?: string;
  state?: number | null;
  type?: number | null;
}

export interface ISetupColor {
  id?: string | null;
  color?: string | null;
  description?: string | null;
  action?: boolean | null;
}

export interface Warehouse{
  id?: string,
  vendorId?: string
  name:string
  description:string
  isMain: number | string | null
}

export interface Supplier{
  id?: string;
  vendorId?: string;
  categoryId?: string;
  name: string;
  address: string;
  taxCode: string;
  bankAccount: string;
  bankName: string;
}

export interface CategorySupplier{
  id?: string;
  vendorId?: string;
  name: string;
}

export interface Vendor {
  id: string,
  name: string,
  refId: string,
  warehouseDomain?: string
}

export interface InventoryProduct {
  productId: string,
  actualQty: number,
  stockQty: number,
}

export interface Inventory {
  id?: string,
  name: string,
  warehouseId: string,
  date: string,
  items: InventoryProduct[],
  status: number | string
}


export interface ReceiptItem {
  id?: string;
  productId?: string;
  qty: number;
  actualQty: number;
  unitPrice: number;
}


export interface Receipt {
  type: number;
  name: string;
  fromWarehouseId: string;
  toWarehouseId: string | null;
  date: string | Dayjs;
  items: ReceiptItem[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  publicKey: string;
  privateKey: string;
}
