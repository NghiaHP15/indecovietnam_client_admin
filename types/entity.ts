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
  email?: string;
  fullname?: string | null;
  password?: string;
  phone?: string;
  isAdmin?: boolean;
  avatar?: string;
  position?: string;
  role?: any;
  gender?: string;
  about?: string;
  address?: string;
  permissions?: any;
  group_user?: string;
  userGroupId?: string;
  confirmPassword?: string;
  menu?: string;
  menuFunc?: string;
  status_active?: string;
  orgId?: string
  date_of_birth?: string;
  vendorId?: string
  refRole?: string
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
  description?: string;
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


export interface ISetupColor {
  id?: string | null;
  color?: string | null;
  description?: string | null;
  action?: boolean | null;
}

export interface CategoriesType {
  id?:string,
  name: string,
  description:string,
  updated_at: string,
  updated_by: string,
}

export interface IRole{
  id?:string,
  name: string,
  description:string,
  created_at: string,
  updated_at: string,
}

export interface IColor {
  id: string,
  name: string,
  code: string,
}

export interface IBlog {
  id?: string,
  title: string,
  slug?: string,
  image: string | null,
  description: string,
  latest_blog: boolean,
  author: {
    id: string,
    fullname: string
  },
  category: {
    id: string,
    title: string,
    slug: string
  },
  published_at: Date,
  tag: string[],
  body: string | null,
}

export interface IBlogCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface IService {
  id?: string,
  title: string,
  slug?: string,
  image: string | null,
  description: string,
  category: {
    id: string,
    title: string,
    slug: string
  },
  published_at: Date,
  tag: string[],
  body: string | null,
}

export interface IServiceCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface IRoomCategory {
  id?: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface IProductCategory {
  id?: string;
  title: string;
  description: string;
  slug: string;
  image: string;
  featured: boolean;
  roomCategory: {
    id: string;
    title: string;
    slug: string;
  }
}

export interface IProduct {
  id?: string
  name: string,
  slug?: string,
  description: string,
  image: string,
  status: string,
  featured: boolean,
  productCategory: {
    id: string,
    title: string,
    slug: string
  },
  body: string,
  min_price?: number,
  max_price?: number,
  variants?: IProductVariant[];
}

export interface IProductVariant {
  id?: string;
  sku?: string;
  image?: string; 
  color?: {
    id: string;
    name: string;
    code: string;
  };
  size?: string;
  price?: number;
  discount?: number;
  is_active?: boolean; 
  quantity_in_stock?: number;
  quantity_reserved?: number;
  quantity_selled?: number;
  product?: {
    id: string;
    name: string;
  };
}

export interface IGallery {
  id?: string;
  title: string;
  description: string;
  image: string;
  href: string;
  type: string;
}

export interface IFeedback {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  show: boolean;
  avatar: string;
  type: string;
  role: string;
}

export interface IMenu {
  id?: string;
  name: string;
  item: string;
  position: string;
}

export interface IAddress {
  id?: string;
  receiver_name: string;
  address_line: string;
  ward: string;
  district: string;
  city: string;
  default?: boolean;
  phone: string;
  customer?: {
    id: string;
    firstname: string;
    lastname: string;
  }
}

export interface ICustomer {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string | null;
  gender?: string;
  level?: string;
  avatar?: string;
  provider?: string;
  password?: string;
  addresses?: IAddress[];
  orders?: IOrder[];
}

export interface IContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  avatar?: string;
  type?: string;
}

export interface IOrder {
  id?: string;
  txnRef?: string;
  order_date: string;
  status?: string;
  payment_status?: string;
  total_amount: number;
  address: IAddress | null;
  note?: string;
  paymentmethod?: string;
  customer: ICustomer | null;
  products: IOrderItem[];
}

export interface IOrderItem {
  id: string;
  name: string;
  slug: string;
  total_price: number;
  quantity: number;
  product_variant: IProductVariant | null;
}

export interface IEmployee {
  id?: string;
  fullname: string;
  password?: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  status_active: boolean;
  avatar: string;
  position: string;
  role: {
    id: string;
    name: string;
  };
}
