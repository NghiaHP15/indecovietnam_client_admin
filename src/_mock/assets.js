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
  //*------- Cài đặt -------*//
  Setting: "Setting",
  InstallApplication: "Install the application",
  Role: "Role",
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

//*------- Báo giá -------*//
const QUOTATION = {
  id: '0000000000000002',
  parentId: '',
  label: 'common.menu.quotation',
  name: ROUTE_NAME.Quotation,
  icon: 'ic-quotation',
  type: PermissionType.CATALOGUE,
  route: 'quotation',
  order: 2,
  path: '[1]',
  children: [
    {
      id: '000000000000000201',
      parentId: '0000000000000002',
      label: 'common.menu.add_quotation',
      name: ROUTE_NAME.AddQuotation,
      type: PermissionType.MENU,
      route: 'add-quotation',
      order: 2,
      component: '/quotation/add_quotation/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
        {
          code: 'create',
          name: 'Create', 
        },
      ],
      permission: [],
      path: '[1].children.[0]',
      pathParent: '[1]',
    },
    {
      id: '000000000000000202',
      parentId: '0000000000000002',
      label: 'common.menu.all_quotation',
      name: ROUTE_NAME.AllQuotation,
      type: PermissionType.MENU,
      route: 'all-quotation',
      order: 2,
      component: '/quotation/all_quotation/index.tsx',
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
      path: '[1].children.[1]',
      pathParent: '[1]',
    },
  ]
}

//*------- Kho hàng -------*//
const INVENTORY = {
  id: '0000000000000003',
  parentId: '',
  label: 'common.menu.inventory',
  name: ROUTE_NAME.Inventory,
  icon: "ic-inventory",
  type: PermissionType.CATALOGUE,
  route: 'inventory',
  order: 3,
  path: '[2]',
  children: [
    {
      id: '000000000000000301',
      parentId: '0000000000000003',
      label: 'common.menu.product',
      name: ROUTE_NAME.Product,
      type: PermissionType.MENU,
      route: 'products',
      order: 3,
      component: '/inventory/products/index.tsx',
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
      path: '[2].children.[0]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000302',
      parentId: '0000000000000003',
      label: 'common.menu.category',
      name: ROUTE_NAME.Category,
      type: PermissionType.MENU,
      route: 'categories',
      order: 3,
      component: '/inventory/categories/index.tsx',
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
      path: '[2].children.[1]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000303',
      parentId: '0000000000000003',
      label: 'common.menu.sub_category',
      name: ROUTE_NAME.SubCategory,
      type: PermissionType.MENU,
      route: 'sub-category',
      order: 3,
      component: '/inventory/sub_category/index.tsx',
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
      path: '[2].children.[2]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000304',
      parentId: '0000000000000003',
      label: 'common.menu.historical_price',
      name: ROUTE_NAME.HistoricalPrice,
      type: PermissionType.MENU,
      route: 'historical-price',
      order: 3,
      component: '/inventory/historical_price/index.tsx',
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
      path: '[2].children.[3]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000305',
      parentId: '0000000000000003',
      label: 'common.menu.brand',
      name: ROUTE_NAME.Brand,
      type: PermissionType.MENU,
      route: 'brand',
      order: 3,
      component: '/inventory/brand/index.tsx',
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
      path: '[2].children.[4]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000306',
      parentId: '0000000000000003',
      label: 'common.menu.unit',
      name: ROUTE_NAME.Unit,
      type: PermissionType.MENU,
      route: 'unit',
      order: 3,
      component: '/inventory/unit/index.tsx',
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
      path: '[2].children.[5]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000307',
      parentId: '0000000000000003',
      label: 'common.menu.stock_in',
      name: ROUTE_NAME.StockIn,
      type: PermissionType.MENU,
      route: 'stock-in',
      order: 3,
      component: '/inventory/stock_in/index.tsx',
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
      path: '[2].children.[6]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000308',
      parentId: '0000000000000003',
      label: 'common.menu.stock_out',
      name: ROUTE_NAME.StockOut,
      type: PermissionType.MENU,
      route: 'stock-out',
      order: 3,
      component: '/inventory/stock_out/index.tsx',
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
      path: '[2].children.[7]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000309',
      parentId: '0000000000000003',
      label: 'common.menu.order',
      name: ROUTE_NAME.Order,
      type: PermissionType.MENU,
      route: 'order',
      order: 3,
      component: '/inventory/order/index.tsx',
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
      path: '[2].children.[8]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000310',
      parentId: '0000000000000003',
      label: 'common.menu.purchase_order',
      name: ROUTE_NAME.PurchaseOrder,
      type: PermissionType.MENU,
      route: 'purchase-order',
      order: 3,
      component: '/inventory/purchase_order/index.tsx',
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
      path: '[2].children.[9]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000311',
      parentId: '0000000000000003',
      label: 'common.menu.stock_usage',
      name: ROUTE_NAME.StockUsage,
      type: PermissionType.MENU,
      route: 'stock-usage',
      order: 3,
      component: '/inventory/stock_usage/index.tsx',
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
      path: '[2].children.[10]',
      pathParent: '[2]',
    },
    {
      id: '000000000000000312',
      parentId: '0000000000000003',
      label: 'common.menu.stock_audit',
      name: ROUTE_NAME.StockAudit,
      type: PermissionType.MENU,
      route: 'stock-audit',
      order: 3,
      component: '/inventory/stock_audit/index.tsx',
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
      path: '[2].children.[11]',
      pathParent: '[2]',
    },
  ]
}

//*------- Đối tác -------*//
const PARTNER = {
  id: '0000000000000004',
  parentId: '',
  label: 'common.menu.partner',
  name: ROUTE_NAME.Partner,
  icon: "ic-accounting",
  type: PermissionType.CATALOGUE,
  route: 'partner',
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
      component: '/partner/customer/index.tsx',
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
      label: 'common.menu.supplier',
      name: ROUTE_NAME.Suppiler,
      type: PermissionType.MENU,
      route: 'suppiler',
      order: 4,
      component: '/partner/suppiler/index.tsx',
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
      label: 'common.menu.user',
      name: ROUTE_NAME.User,
      type: PermissionType.MENU,
      route: 'user',
      order: 4,
      component: '/partner/user/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
      ],
      permission: [],
      path: '[3].children.[2]',
      pathParent: '[3]',
    },
  ]
}

//*------- Báo cáo -------*//
const REPORT = {
  id: '0000000000000005',
  parentId: '',
  label: 'common.menu.report',
  name: 'Report',
  icon: "ic-report",
  type: PermissionType.CATALOGUE,
  route: 'report',
  order: 5,
  path: '[4]',
  children: [
    {
      id: '000000000000000501',
      parentId: '0000000000000005',
      label: 'common.menu.summary_report',
      name: ROUTE_NAME.SummaryReport,
      type: PermissionType.MENU,
      route: 'summary-report',
      order: 5,
      component: '/report/summary_report/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
      ],
      permission: [],
      path: '[4].children.[0]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000502',
      parentId: '0000000000000005',
      label: 'common.menu.product_report',
      name: ROUTE_NAME.ProductReport,
      type: PermissionType.MENU,
      route: 'product-report',
      order: 5,
      component: '/report/product_report/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
      ],
      permission: [],
      path: '[4].children.[1]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000503',
      parentId: '0000000000000005',
      label: 'common.menu.customer_report',
      name: ROUTE_NAME.CustomerReports,
      type: PermissionType.MENU,
      route: 'customer-reports',
      order: 5,
      component: '/report/customer_report/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
      ],
      permission: [],
      path: '[4].children.[2]',
      pathParent: '[4]',
    },
    {
      id: '000000000000000504',
      parentId: '0000000000000005',
      label: 'common.menu.supplier_report',
      name: ROUTE_NAME.SupplierReport,
      type: PermissionType.MENU,
      route: 'supplier-report',
      order: 5,
      component: '/report/supplier_report/index.tsx',
      func: [
        {
          code: 'view',
          name: "View",
        },
      ],
      permission: [],
      path: '[4].children.[3]',
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
      label: 'common.menu.template',
      name: ROUTE_NAME.Template,
      type: PermissionType.MENU,
      route: 'template',
      order: 6,
      component: '/setting/template/index.tsx',
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
    {
      id: '000000000000000604',
      parentId: '0000000000000006',
      label: 'common.menu.storage',
      name: ROUTE_NAME.Storage,
      type: PermissionType.MENU,
      route: 'storage',
      order: 6,
      component: '/setting/storage/index.tsx',
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
      path: '[5].children.[3]',
      pathParent: '[5]',
    },
    {
      id: '000000000000000605',
      parentId: '0000000000000006',
      label: 'common.menu.tax',
      name: ROUTE_NAME.Tax,
      type: PermissionType.MENU,
      route: 'tax',
      order: 6,
      component: '/setting/tax/index.tsx',
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
      path: '[5].children.[4]',
      pathParent: '[5]',
    },
    {
      id: '000000000000000606',
      parentId: '0000000000000006',
      label: 'common.menu.payment_method',
      name: ROUTE_NAME.PaymentMethod,
      type: PermissionType.MENU,
      route: 'payment-method',
      order: 6,
      component: '/setting/payment_method/index.tsx',
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
      path: '[5].children.[5]',
      pathParent: '[5]',
    },
    {
      id: '000000000000000607',
      parentId: '0000000000000006',
      label: 'common.menu.language',
      name: ROUTE_NAME.Language,
      type: PermissionType.MENU,
      route: 'language',
      order: 6,
      component: '/setting/language/index.tsx',
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
      path: '[5].children.[6]',
      pathParent: '[5]',
    }
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
  route: 'account',
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
      component: '/account/profile/index.tsx',
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
      label: 'common.menu.logout',
      name: ROUTE_NAME.Logout,
      type: PermissionType.MENU,
      route: 'logout',
      order: 7,
      component: '/account/logout/index.tsx',
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
export const PERMISSION_LIST = [DASHBOARD, QUOTATION, INVENTORY, PARTNER, REPORT, SETTING, ACCOUNT];

/**
 * Check Role Permission
 */
let a = cloneDeep(PERMISSION_LIST)
a.map(o => {
  if(o.permission) {
    o.permission = ["view", "create", "update", "export_excel", "import_excel", "export_pdf", "print", "reset"]
  }
  o.children?.map(x => {
    if(x.permission) {
      x.permission = ["view", "create", "update", "export_excel", "import_excel", "export_pdf", "print", "reset"]
    }
  })
})

console.log(JSON.stringify(a));


/**
 * User role mock
 */
const ADMIN_ROLE = {
  id: '4281707933534332',
  name: 'Admin',
  label: 'admin',
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
  username: 'admin',
  email: faker.internet.email(),
  avatar: faker.image.avatarGitHub(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.recent(),
  password: '12345678',
  role: ADMIN_ROLE,
  permissions: ADMIN_ROLE.permission,
};

export const USER_LIST = [DEFAULT_USER];
