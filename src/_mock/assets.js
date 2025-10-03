import { faker } from '@faker-js/faker';
import { BasicStatus, PermissionType } from '#/enum';
import { t } from 'i18next';
import { path, product } from 'ramda';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import { co } from 'node_modules/@fullcalendar/core/internal-common';

export const ROUTE_NAME = {
  DashBoard: "Dashborad",
  //*------- Báo giá -------*//
  Quotation: "Quotation",
  AddQuotation: "Add quotation",
  AllQuotation: "All quotation",
  //*------- Kho hàng -------*//
  Inventory: "Inventory",
  Product: "Product",
  Category: "Category",
  SubCategory: "Sub category",
  HistoricalPrice: "Historical price",
  Brand: "Brand",
  Unit: "Unit",
  StockIn: "Stock in",
  StockOut: "Stock out",
  Order: "Order",
  PurchaseOrder: "Purchase order",
  StockUsage: "Stock usage",
  StockAudit: "Stock audit",
  //*------- Đối tác -------*//
  Partner: "Partner",
  Customer: "Customer",
  Suppiler: "Suppiler",
  User: "User",
  //*------- Báo cáo -------*//
  SummaryReport: "Summary report",
  ProductReport: "Product report",
  CustomerReports: "Customer reports",
  SupplierReport: "SupplierReport",
  //*------- Quan trị -------*//
  Management: "Management",
  Employee: "Employee",
  Customer: "Customer",
  Order: "Order",
  //*------- Hệ thống website -------*//
  Product: "Product",
  ProductVariant: "Product variant",
  ProductCategory: "Product category",
  RoomCategory: "Room category",
  Blog: "Blog",
  BlogCategory: "Blog category",
  Service: "Service",
  ServiceCategory: "Service category",
  Gallery: "Gallery",
  Menu: "Menu",
  Feedback: "Feedback",
  Address: "Address",
  Color: "Color",
  Policy: "Policy",
  //*------- Cài đặt -------*//
  Setting: "Setting",
  InstallApplication: "Install the application",
  Role: "Role",
  Image: "Image",
  DetailRole: "Detail role",
  Template: "Template",
  Storage: "Storage",
  Tax: "Tax",
  PaymentMethod: "Payment method",
  Language: "Language",
  //*------- Tài khoản -------*//
  Account: "Account",
  Profile: "Profile",
  Logout: "Logout",
}

//*------- Quyền -------*//
export const PERMISSION_ACTION = {
  view: "view",
  update: "update",
  create: "create",
  delete: "delete",
  import_excel: "import_excel",
  export_excel: "export_excel",
  export_pdf: "export_pdf",
  print: "print",
  reset: "reset",
}

//*------- Trang chủ -------*//
const DASHBOARD = {
  id: '0000000000000001',
  parentId: '',
  label: 'common.menu.dashboard',
  name: ROUTE_NAME.DashBoard,
  icon: "ic-dashboard",
  type: PermissionType.CATALOGUE,
  route: 'dashborad',
  component: '/dashboard/workbench/index.tsx',
  order: 1,
  path: '[0]',
  func: [
    {
      code: 'view',
      name: "View",
    },
    {
      code: 'update',
      name: 'Update',
    }
  ],
  permission: [],
}


//*------- Kho hàng -------*//
const INVENTORY = {
  id: '0000000000000002',
  parentId: '',
  label: 'common.menu.inventory',
  name: ROUTE_NAME.Inventory,
  icon: "ic-inventory",
  type: PermissionType.CATALOGUE,
  route: 'inventory',
  order: 2,
  path: '[1]',
  func: [
    {
      code: 'view',
      name: "View",
    },
    {
      code: 'update',
      name: 'Update',
    }
  ],
  permission: [],
  // children: []
}

//*------- Báo cáo -------*//
const REPORT = {
  id: '0000000000000003',
  parentId: '',
  label: 'common.menu.report',
  name: 'Report',
  icon: "ic-report",
  type: PermissionType.CATALOGUE,
  route: 'report',
  order: 3,
  path: '[2]',
  func: [
    {
      code: 'view',
      name: "View",
    },
    {
      code: 'update',
      name: 'Update',
    }
  ],
  permission: [],
  // children: [
  //   {
  //     id: '000000000000000501',
  //     parentId: '0000000000000005',
  //     label: 'common.menu.summary_report',
  //     name: ROUTE_NAME.SummaryReport,
  //     type: PermissionType.MENU,
  //     route: 'summary-report',
  //     order: 5,
  //     component: '/report/summary_report/index.tsx',
  //     func: [
  //       {
  //         code: 'view',
  //         name: "View",
  //       },
  //     ],
  //     permission: [],
  //     path: '[4].children.[0]',
  //     pathParent: '[4]',
  //   },
  //   {
  //     id: '000000000000000502',
  //     parentId: '0000000000000005',
  //     label: 'common.menu.product_report',
  //     name: ROUTE_NAME.ProductReport,
  //     type: PermissionType.MENU,
  //     route: 'product-report',
  //     order: 5,
  //     component: '/report/product_report/index.tsx',
  //     func: [
  //       {
  //         code: 'view',
  //         name: "View",
  //       },
  //     ],
  //     permission: [],
  //     path: '[4].children.[1]',
  //     pathParent: '[4]',
  //   },
  //   {
  //     id: '000000000000000503',
  //     parentId: '0000000000000005',
  //     label: 'common.menu.customer_report',
  //     name: ROUTE_NAME.CustomerReports,
  //     type: PermissionType.MENU,
  //     route: 'customer-reports',
  //     order: 5,
  //     component: '/report/customer_report/index.tsx',
  //     func: [
  //       {
  //         code: 'view',
  //         name: "View",
  //       },
  //     ],
  //     permission: [],
  //     path: '[4].children.[2]',
  //     pathParent: '[4]',
  //   },
  //   {
  //     id: '000000000000000504',
  //     parentId: '0000000000000005',
  //     label: 'common.menu.supplier_report',
  //     name: ROUTE_NAME.SupplierReport,
  //     type: PermissionType.MENU,
  //     route: 'supplier-report',
  //     order: 5,
  //     component: '/report/supplier_report/index.tsx',
  //     func: [
  //       {
  //         code: 'view',
  //         name: "View",
  //       },
  //     ],
  //     permission: [],
  //     path: '[4].children.[3]',
  //     pathParent: '[4]',
  //   },
  // ]
}

//*------- Quan ly -------*//
const MANAGER = {
  id: '0000000000000004',
  parentId: '',
  label: 'common.menu.management',
  name: ROUTE_NAME.Management,
  icon: "ic-accounting",
  type: PermissionType.CATALOGUE,
  route: 'management',
  order: 4,
  path: '[3]',
  children: [
    {
      id: '000000000000000401',
      parentId: '0000000000000004', 
      label: 'common.menu.customer',
      name: ROUTE_NAME.Customer,
      type: PermissionType.MENU,
      route: 'customer',
      order: 4,
      component: '/management/customer/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[3].children.[0]',
      pathParent: '[3]',
    },
    {
      id: '000000000000000402',
      parentId: '0000000000000004',
      label: 'common.menu.employee',
      name: ROUTE_NAME.Employee,
      type: PermissionType.MENU,
      route: 'employee',
      order: 4,
      component: '/management/employee/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[3].children.[1]',
      pathParent: '[3]',
    },
    {
      id: '000000000000000403',
      parentId: '0000000000000004',
      label: 'common.menu.order',
      name: ROUTE_NAME.Order,
      type: PermissionType.MENU,
      route: 'order',
      order: 4,
      component: '/management/order/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[3].children.[2]',
      pathParent: '[3]',
    },
    {
      id: '000000000000000404',
      parentId: '0000000000000004',
      label: 'common.menu.product',
      name: ROUTE_NAME.Product,
      type: PermissionType.MENU,
      route: 'product',
      order: 4,
      component: '/management/product/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[3].children.[3]',
      pathParent: '[3]',
    },
    {
      id: '000000000000000405',
      parentId: '0000000000000004',
      label: 'common.menu.product_variant',
      name: ROUTE_NAME.ProductVariant,
      type: PermissionType.MENU,
      route: 'product-variant',
      order: 4,
      component: '/management/product-variant/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[3].children.[4]',
      pathParent: '[3]',
    },
    {
      id: '000000000000000406',
      parentId: '0000000000000004',
      label: 'common.menu.product_category',
      name: ROUTE_NAME.ProductCategory,
      type: PermissionType.MENU,
      route: 'product-category',
      order: 4,
      component: '/management/product-category/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[3].children.[5]',
      pathParent: '[3]',
    },
    {
      id: '000000000000000407',
      parentId: '0000000000000004',
      label: 'common.menu.room-category',
      name: ROUTE_NAME.RoomCategory,
      type: PermissionType.MENU,
      route: 'room-category',
      order: 4,
      component: '/management/room-category/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[3].children.[6]',
      pathParent: '[3]',
    },
  ]
}

//*------- Hệ thông website -------*//
const WEBSITE = {
  id: '0000000000000005',
  parentId: '',
  label: 'common.menu.website',
  name: 'Website',
  icon: "ic-quotation",
  type: PermissionType.CATALOGUE,
  route: 'system-website',
  order: 5,
  path: '[4]',
  children: [
    {
      id: '000000000000000501',
      parentId: '0000000000000005',
      label: 'common.menu.blog',
      name: ROUTE_NAME.Blog,
      type: PermissionType.MENU,
      route: 'blog',
      order: 5,
      component: '/system-website/blog/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[0]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000502',
      parentId: '0000000000000005',
      label: 'common.menu.blog-category',
      name: ROUTE_NAME.BlogCategory,
      type: PermissionType.MENU,
      route: 'blog-category',
      order: 5,
      component: '/system-website/blog-category/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[1]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000503',
      parentId: '0000000000000005',
      label: 'common.menu.service',
      name: ROUTE_NAME.Service,
      type: PermissionType.MENU,
      route: 'service',
      order: 5,
      component: '/system-website/service/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[2]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000504',
      parentId: '0000000000000005',
      label: 'common.menu.service-category',
      name: ROUTE_NAME.ServiceCategory,
      type: PermissionType.MENU,
      route: 'service-category',
      order: 5,
      component: '/system-website/service-category/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[3]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000505',
      parentId: '0000000000000005',
      label: 'common.menu.gallery',
      name: ROUTE_NAME.Gallery,
      type: PermissionType.MENU,
      route: 'gallery',
      order: 5,
      component: '/system-website/gallery/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[4]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000506',
      parentId: '0000000000000005',
      label: 'common.menu.feedback',
      name: ROUTE_NAME.Feedback,
      type: PermissionType.MENU,
      route: 'feedback',
      order: 5,
      component: '/system-website/feedback/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[5]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000507',
      parentId: '0000000000000005',
      label: 'common.menu.menu',
      name: ROUTE_NAME.Menu,
      type: PermissionType.MENU,
      route: 'menu',
      order: 5,
      component: '/system-website/menu/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[6]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000508',
      parentId: '0000000000000005',
      label: 'common.menu.color',
      name: ROUTE_NAME.Color,
      type: PermissionType.MENU,
      route: 'color',
      order: 5,
      component: '/system-website/color/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[7]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000509',
      parentId: '0000000000000005',
      label: 'common.menu.address',
      name: ROUTE_NAME.Address,
      type: PermissionType.MENU,
      route: 'address',
      order: 5,
      component: '/system-website/address/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[8]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000510',
      parentId: '0000000000000005',
      label: 'common.menu.policy',
      name: ROUTE_NAME.Policy,
      type: PermissionType.MENU,
      route: 'policy',
      order: 5,
      component: '/system-website/policy/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[4].children.[9]',
      pathParent: '[4]',
    },
  ]
}

//*------- Cài đặt -------*//
const SETTING = {
  id: '0000000000000006',
  parentId: '',
  label: 'common.menu.setting',
  name: 'Setting',
  icon: "ic-setting",
  type: PermissionType.CATALOGUE,
  route: 'setting',
  order: 6,
  path: '[5]',
  children: [
    {
      id: '000000000000000601',
      parentId: '0000000000000006',
      label: 'common.menu.install_application',
      name: ROUTE_NAME.InstallApplication,
      type: PermissionType.MENU,
      route: 'install-application',
      order: 6,
      component: '/setting/install_application/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        }
      ],
      permission: [],
      path: '[5].children.[0]',
      pathParent: '[5]',
    },
    {
      id: '000000000000000602',
      parentId: '0000000000000006',
      label: 'common.menu.role',
      name: ROUTE_NAME.Role,
      type: PermissionType.MENU,
      route: 'role',
      order: 6,
      component: '/setting/role/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[5].children.[1]',
      pathParent: '[5]',
    },
    {
      id: '000000000000000603',
      parentId: '0000000000000006',
      label: 'common.menu.image',
      name: ROUTE_NAME.Image,
      type: PermissionType.MENU,
      route: 'image',
      order: 6,
      component: '/setting/image/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create',
        },
        {
          code: 'update',
          name: 'Update',
        },
        {
          code: 'delete',
          name: 'Delete',
        },
      ],
      permission: [],
      path: '[5].children.[2]',
      pathParent: '[5]',
    },
    
    // {
    //   id: '000000000000000604',
    //   parentId: '0000000000000006',
    //   label: 'common.menu.storage',
    //   name: ROUTE_NAME.Storage,
    //   type: PermissionType.MENU,
    //   route: 'storage',
    //   order: 6,
    //   component: '/setting/storage/index.tsx',
    //   func: [
    //     {
    //       code: 'view',
    //       name: "View",
    //     },
    //     {
    //       code: 'create',
    //       name: 'Create',
    //     },
    //     {
    //       code: 'update',
    //       name: 'Update',
    //     },
    //     {
    //       code: 'delete',
    //       name: 'Delete',
    //     },
    //   ],
    //   permission: [],
    //   path: '[5].children.[3]',
    //   pathParent: '[5]',
    // },
    // {
    //   id: '000000000000000605',
    //   parentId: '0000000000000006',
    //   label: 'common.menu.tax',
    //   name: ROUTE_NAME.Tax,
    //   type: PermissionType.MENU,
    //   route: 'tax',
    //   order: 6,
    //   component: '/setting/tax/index.tsx',
    //   func: [
    //     {
    //       code: 'view',
    //       name: "View",
    //     },
    //     {
    //       code: 'create',
    //       name: 'Create',
    //     },
    //     {
    //       code: 'update',
    //       name: 'Update',
    //     },
    //     {
    //       code: 'delete',
    //       name: 'Delete',
    //     },
    //   ],
    //   permission: [],
    //   path: '[5].children.[4]',
    //   pathParent: '[5]',
    // },
    // {
    //   id: '000000000000000606',
    //   parentId: '0000000000000006',
    //   label: 'common.menu.payment_method',
    //   name: ROUTE_NAME.PaymentMethod,
    //   type: PermissionType.MENU,
    //   route: 'payment-method',
    //   order: 6,
    //   component: '/setting/payment_method/index.tsx',
    //   func: [
    //     {
    //       code: 'view',
    //       name: "View",
    //     },
    //     {
    //       code: 'create',
    //       name: 'Create',
    //     },
    //     {
    //       code: 'update',
    //       name: 'Update',
    //     },
    //     {
    //       code: 'delete',
    //       name: 'Delete',
    //     },
    //   ],
    //   permission: [],
    //   path: '[5].children.[5]',
    //   pathParent: '[5]',
    // },
    // {
    //   id: '000000000000000607',
    //   parentId: '0000000000000006',
    //   label: 'common.menu.language',
    //   name: ROUTE_NAME.Language,
    //   type: PermissionType.MENU,
    //   route: 'language',
    //   order: 6,
    //   component: '/setting/language/index.tsx',
    //   func: [
    //     {
    //       code: 'view',
    //       name: "View",
    //     },
    //     {
    //       code: 'create',
    //       name: 'Create',
    //     },
    //     {
    //       code: 'update',
    //       name: 'Update',
    //     },
    //     {
    //       code: 'delete',
    //       name: 'Delete',
    //     },
    //   ],
    //   permission: [],
    //   path: '[5].children.[6]',
    //   pathParent: '[5]',
    // }
  ]
}

//*------- Tài khoản -------*//
const ACCOUNT = {
  id: '0000000000000007',
  parentId: '',
  label: 'common.menu.account',
  name: 'Account',
  icon: "ic-profile",
  type: PermissionType.CATALOGUE,
  route: 'user',
  order: 7,
  path: '[6]',
  children: [
    {
      id: '000000000000000701',
      parentId: '0000000000000007',
      label: 'common.menu.profile',
      name: ROUTE_NAME.Profile,
      type: PermissionType.MENU,
      route: 'profile',
      order: 7,
      component: '/user/profile/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'Create',
          name: "Create",
        },
      ],
      permission: [],
      path: '[6].children.[0]',
      pathParent: '[6]',
    },
    {
      id: '000000000000000702',
      parentId: '0000000000000007',
      label: 'common.menu.account',
      name: ROUTE_NAME.Logout,
      type: PermissionType.MENU,
      route: 'account',
      order: 7,
      component: '/user/account/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
      ],
      permission: [],
      path: '[6].children.[1]',
      pathParent: '[6]',
    }
  ]
}

//*------- Permission List -------*//
// export const PERMISSION_LIST = [DASHBOARD, QUOTATION, INVENTORY, PARTNER, REPORT, SETTING, ACCOUNT];
export const PERMISSION_LIST = [DASHBOARD, INVENTORY, REPORT, MANAGER, WEBSITE, SETTING, ACCOUNT];

/**
 * Check Role Permission
 */
let a = cloneDeep(PERMISSION_LIST)
a.map(o => {
  if(o.permission) {
    o.permission = ["view", "create", "update", "delete" ,"export_excel", "import_excel", "export_pdf", "print", "reset"]
  }
  o.children?.map(x => {
    if(x.permission) {
      x.permission = ["view", "create", "update", "delete", "export_excel", "import_excel", "export_pdf", "print", "reset"]
    }
  })
})

console.log(JSON.stringify(a));


/**
 * User role mock
 */
const ADMIN_ROLE = {
  id: 'b94719e1-ce46-457e-9575-99505ecee822',
  name: 'Admin',
  status: BasicStatus.ENABLE,
  order: 1,
  desc: 'Super Admin',
  permission: PERMISSION_LIST,
};
export const ROLE_LIST = [ADMIN_ROLE];

/**
 * User data mock
 */
export const DEFAULT_USER = {
  id: 'b34719e1-ce46-457e-9575-99505ecee828',
  email: 'indeco@admin.com',
  avatar: faker.image.avatarGitHub(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.recent(),
  password: '123456',
  role: ADMIN_ROLE,
  permissions: ADMIN_ROLE.permission,
};

export const USER_LIST = [DEFAULT_USER];
