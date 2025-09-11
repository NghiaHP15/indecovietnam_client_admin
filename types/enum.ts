export enum MODE {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  VIEW = "VIEW"
}

export const GENDER = {
  list: [
    {
      id: true,
      name: 'common.male'
    },
    {
      id: false,
      name: 'common.female'
    },
  ],
  MALE: true,
  FEMALE: false,
}

export const GENDER_OPTIONS = {
  list: [
    {
      value: "male",
      label: 'common.male'
    },
    {
      value: "female",
      label: 'common.female'
    },
    {
      value: "other",
      label: 'common.other'
    },
  ],
  MALE: "male", //Nam
  FEMALE: "female", //Nữ
  OTHER: "other",
}

export const ROLE_CODE = {
  items: [
    {
      value: "SUPER_ADMIN",
      label: "Super Admin"
    },
    {
      value: "MANAGER",
      label: "Manager"
    },
    {
      value: "ADMIN",
      label: "Admin"
    },
    {
      value: "STAFF",
      label: "Staff"
    },
  ]
}

export enum BasicStatus {
  DISABLE,
  ENABLE,
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
}

export enum BasicStatusCode {
  INACTIVE = 'error',
  ACTIVE = 'success',
  LOCK = 'warning',
  UNLOCK = 'success',
  true = 'success',
  false = 'error',
}

export enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 401,
}

export enum StorageEnum {
  User = 'user',
  Token = 'token',
  Settings = 'settings',
  I18N = 'i18nextLng',
  Layouts = 'layouts',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export enum ThemeLayout {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Mini = 'mini',
}

export enum ThemeColorPresets {
  Cyan = 'cyan',
  Purple = 'purple',
  Blue = 'blue',
  Orange = 'orange',
  Red = 'red',
  Green = 'green',
}

export enum LocalEnum {
  en_US = 'en_US',
  vi_VN = 'vi_VN',
  na_NY = 'na_NY'
}

export enum RoleEnum {
  admin = 'ADMIN',
  superadmin = 'SUPERADMIN',
  manager = 'MANAGER',
  user = 'USER'
}

export enum MultiTabOperation {
  FULLSCREEN = 'fullscreen',
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHERS = 'closeOthers',
  CLOSEALL = 'closeAll',
  CLOSELEFT = 'closeLeft',
  CLOSERIGHT = 'closeRight',
}

export enum PermissionType {
  CATALOGUE,
  MENU,
  BUTTON,
}

export interface MonthItem {
  id: string;
  name: string;
}

export const Months: MonthItem[] = [
  { id: '1', name: 'Tháng 1' },
  { id: '2', name: 'Tháng 2' },
  { id: '3', name: 'Tháng 3' },
  { id: '4', name: 'Tháng 4' },
  { id: '5', name: 'Tháng 5' },
  { id: '6', name: 'Tháng 6' },
  { id: '7', name: 'Tháng 7' },
  { id: '8', name: 'Tháng 8' },
  { id: '9', name: 'Tháng 9' },
  { id: '10', name: 'Tháng 10' },
  { id: '11', name: 'Tháng 11' },
  { id: '12', name: 'Tháng 12' },
];

export enum PageSize {
  Ten = '10',
  Twenty = '20',
  Fifty = '50',
  Hundred = '100',
}


export enum StatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
}


export const STATUS_OPTIONS = {
  list: [
    {
      id: 1,
      name: 'common.active'
    },
    {
      id: 0,
      name: 'common.deactive'
    },
  ],
  ACTIVE: 1, //Đang sử dụng
  INACTIVE: 0, //Ngưng sử dụng
}

export const EXCEL_USER_CONFIG_FIELD = {
  username: "Tài khoản",
  fullName: "Họ và tên",
  email: "Email",
  orgName: "Đơn vị",
  userGroupName: "Vai trò",
  expirationAt: "Ngày hết hạn",
  state: "Trạng thái",
  phone: "Số điện thoại",
  titleName: "Chức danh",
  birthDate: "Ngày sinh",
  gender: "Giới tính",
  managementLevel: "Cấp quản lý",
}

export const STATE_OPTIONS = {
  list: [
    {
      id: "ACTIVE",
      name: 'common.status.active'
    },
    {
      id: "INACTIVE",
      name: 'common.status.inactive'
    },
  ],
  ACTIVE: "ACTIVE", //Đang sử dụng
  INACTIVE: "INACTIVE", //Ngưng sử dụng
}

export const CommonPageSizeOptions = Object.values(PageSize) as string[];

export const EXCEL_DRIVER_CONFIG_FIELD = {
  name: "Tên",
  birthDay: "Ngày sinh",
  gender: "Giới tính",
  phone: "Số điện thoại",
  email: "Email",
  idCard: "Số CCCD",
  org: "Thuộc đơn vị",
  address: "Địa chỉ",
  groupName: "Tổ đội",
  manager: "Người quản lý",
  managerPhone: "Số điện thoại quản lý",
  licenseNumber: "Số GPLX",
  licenseType: "Hạng",
  experience: "Kinh nghiệm",
  licenseDate: "Ngày cấp",
  expiryDate: "Ngày hết hạn",
  licensePlace: "Nơi cấp",
}

export const EXCEL_PRODUCT_CONFIG_FIELD = {
  name: "Tên",
  description: "Mô tả",
  price: "Giá",
  category: "Danh mục",
  is_available: "Trạng thái",
}

export const EXCEL_SUPPLIER_CONFIG_FIELD  = {
  name:"Tên nhà cung cấp",
  address:"Địa chỉ",
  bankAccount:"Số tài khoản",
  bankName:"Tên tài khoản",
  taxCode:"Mã số thuế"
}
export const EXCEL_WAREHOUSE_LIST_CONFIG_FIELD  = {
  name:"Tên nhà cung cấp",
  description:"Mô tả",
  isMain:"Loại",
}

export const LOGIN_TYPE ={
  AUTO:"AUTO",
  LOGIN:"LOGIN"
}

export const STATUS_PRODUCT = {
  list: [
    {
      label: "website.product.status-product.new",
      value: "new",
    },
    {
      label: "website.product.status-product.hot",
      value: "hot",
    },
    {
      label: "website.product.status-product.sale",
      value: "sale",
    },
    {
      label: "website.product.status-product.default",
      value: "default",
    },
  ],
  NEW:"new",
  HOT:"hot",
  SALE:"sale",
  DEFAULT:"default",
}

export const SIZE_PRODUCT = {
  list: [
    {
      label: "website.product-variant.size.small",
      value: "small",
    },
    {
      label: "website.product-variant.size.medium",
      value: "medium",
    },
    {
      label: "website.product-variant.size.large",
      value: "large",
    },
  ],
  SMALL:"small",
  MEDIUM:"medium",
  LARGE:"large",
}

export const TYPE_GALLERY = {
  list: [
    {
      label: "website.gallery.type.slider",
      value: "slider",
    },
    {
      label: "website.gallery.type.banner",
      value: "banner",
    },
    {
      label: "website.gallery.type.design",
      value: "design",
    },
    {
      label: "website.gallery.type.social",
      value: "social",
    },
  ],
  SLIDER: "slider",
  BANNER: "banner",
  DESIGN: "design",
  SOCIAL: "social",
}

export const TYPE_FFEDBACK = {
  list: [
    {
      label: "website.feedback.type.feedback",
      value: "feedback",
    },
    {
      label: "website.feedback.type.contact",
      value: "contact",
    },
    {
      label: "website.feedback.type.design",
      value: "design",
    },
    {
      label: "website.feedback.type.other",
      value: "other",
    },
  ],
  FEEDBACK: "feedback",
  CONTACT: "contact",
  DESIGN: "design",
  OTHER: "other",
}

export const LEVEL_CUSTOMER = {
  list: [
    {
      label: "management.customer.level.silver",
      value: "silver",
    },
    {
      label: "management.customer.level.gold",
      value: "gold",
    },
    {
      label: "management.customer.level.vip",
      value: "vip",
    },
  ],
  SLIVER: "silver",
  GOLD: "gold",
  VIP: "vip",
}

export const PROVIDER_CUSTOMER = {
  list: [
    {
      label: "management.customer.provider.google",
      value: "google",
    },
    {
      label: "management.customer.provider.facebook",
      value: "facebook",
    },
    {
      label: "management.customer.provider.local",
      value: "local",
    }
  ],
  GOOGLE: "google",
  FACEBOOK: "facebook",
  LOCAL: "local",
}

export const PAYMENT_STATUS = {
  list: [
    {
      label: "management.order.payment_status.pending",
      value: "pending",
      style: "#FFE100",
    },
    {
      label: "management.order.payment_status.paid",
      value: "paid",
      style: "#08CB00",
    },
    {
      label: "management.order.payment_status.awaiting_confirmation",
      value: "awaiting_confirmation",
      style: "#33A1E0",
    },
    {
      label: "management.order.payment_status.cancelled",
      value: "cancel",
      style: "#E43636",
    },
    {
      label: "management.order.payment_status.failed",
      value: "failed",
      style: "#E43636",
    },
  ],
  PENDING: "pending",
  PAID: "paid",
  AWAITINGCOFIRMATION: "awaiting_confirmation",
  CANCELLED: "cancel",
  FAILED: "failed",
}

export const ORDER_STATUS = {
  list: [
    {
      label: "management.order.order_status.pending",
      value: "pending",
      style: "#FFE100",
    },
    {
      label: "management.order.order_status.processing",
      value: "processing",
      style: "#33A1E0",
    },
    {
      label: "management.order.order_status.shipped",
      value: "shipped",
      style: "#FEA405",
    },
    {
      label: "management.order.order_status.delivered",
      value: "delivered",
      style: "#08CB00",
    },
    {
      label: "management.order.order_status.cancelled",
      value: "cancelled",
      style: "#E43636",
    },
  ],
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
}

export const POSITION_EMPLOYEEE = {
  list: [
    {
      label: "management.employee.position.ceo",
      value: "ceo",
    },
    {
      label: "management.employee.position.manager",
      value: "manager",
    },
    {
      label: "management.employee.position.cskh",
      value: "cskh",
    },
    {
      label: "management.employee.position.staff",
      value: "staff",
    },
    {
      label: "management.employee.position.other",
      value: "other",
    },
  ],
  CEO: "ceo",
  MANAGER: "manager",
  CSKH: "cskh",
  STAFF: "staff",
  OTHER: "other",
}

export const STATUS_EMPLOYEE = {
  list: [
    {
      label: "management.employee.status_active.active",
      value: "active",
    },
    {
      label: "management.employee.status_active.inactive",
      value: "inactive",
    },
  ],
  ACTIVE: "active",
  INACTIVE: "inactive",
}

export const NOTI_TYPE = {
  ORDER: "order",
  CONTACT: "contact",
}

export const SORT_IMAGE = {
  list: [
    {
      label: "common.newest",
      value: "desc",
    },
    {
      label: "common.oldest",
      value: "asc",
    }
  ],
  CREATE_AT_ASC: "asc",
  CREATE_AT_DESC: "desc",
}