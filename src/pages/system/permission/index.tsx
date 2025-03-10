// import { Button, Input, notification, Popconfirm, Space, Tooltip, Typography } from 'antd';
// import { CommonPageSizeOptions, EXCEL_WAREHOUSE_LIST_CONFIG_FIELD } from '#/enum';
// import Table, { ColumnsType } from 'antd/es/table';
// import { useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Warehouse } from '#/entity';
// import 'jspdf-autotable';
// import Region, { RegionCenter, RegionTop } from '@/layouts/_common/Region';
// import HeaderApp from '@/components/header-app';
// import {
//   DeleteOutlined,
//   EditOutlined,
//   IdcardOutlined,
//   PlusOutlined,
//   UploadOutlined,
// } from '@ant-design/icons';
// import { usePermission } from '@/store/userStore';
// import { PERMISSION_ACTION, ROUTE_NAME } from '@/_mock/assets';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import warehouseService from '@/api/services/warehouseService';
// import * as excelJS from 'exceljs';
// import WarehouseDetail from './detail';

// export default function PermissionScreen() {
//   const queryClient = useQueryClient();

//   const { t } = useTranslation();

//   const permission: any = {}

//   const [lazyParams, setLazyParams] = useState<any>({
//     page: 1,
//     size: 20,
//     keyword: '',
//     keywordFormat: '',
//   });

//   const [orgs, _setOrgs] = useState<any[]>([]);

//   const refDetail = useRef<any>();

//   const { data, isLoading } = useQuery({
//     queryKey: ['warehouse', lazyParams.page],
//     queryFn: () => warehouseService.getWarehouse(lazyParams),
//     retry: 3
//   });

//   const { mutateAsync: deleteSupplier } = useMutation({
//     mutationFn: async (id: string) => warehouseService.deleteWarehouse(id),
//   });

//   const onEdit = (rowData: any) => () => {
//     refDetail.current.update(rowData);
//   };

//   const onDelete = (_rowData: any) => () => {
//     deleteSupplier(_rowData.id)
//       .then(() => {
//         queryClient.invalidateQueries({ queryKey: ['warehouse'] });
//         notification.success({
//           message: t('common.success'),
//           duration: 3,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const columns: ColumnsType<Warehouse> = [
//     {
//       title: t('common.no.'),
//       dataIndex: 'STT',
//       width: 50,
//       align: 'center',
//       render: (_, __, index) => <div>{lazyParams.page * lazyParams.size + index + 1}</div>,
//     },
//     {
//       title: t('category.warehouse.name'),
//       dataIndex: 'name',
//       width: 150,
//     },
//     {
//       title: t('category.warehouse.description'),
//       dataIndex: 'description',
//       width: 150,
//     },
//     {
//       title: t('category.warehouse.type'),
//       dataIndex: 'isMain',
//       width: 150,
//       render: (value) => (value === 1 ? t('category.warehouse.primary') : t('category.warehouse.secondary')),
//     },
//     {
//       width: 20,
//       align: 'center',
//       fixed: 'right',
//       render: (_, record: any) => (
//         <Space.Compact prefix="|">
//           <Tooltip title={t('common.edit')}>
//             <Button
//               disabled={!permission[PERMISSION_ACTION.update]}
//               color="primary"
//               type="link"
//               icon={<EditOutlined />}
//               onClick={onEdit(record)}
//             />
//           </Tooltip>
//           <Popconfirm
//             title={t('common.title_delete')}
//             okText={t('common.delete')}
//             cancelText={t('common.cancel')}
//             placement="left"
//             onConfirm={onDelete(record)}
//           >
//             <Tooltip title={t('common.delete')}>
//               <Button
//                 color="danger"
//                 disabled={!permission[PERMISSION_ACTION.delete]}
//                 icon={<DeleteOutlined />}
//                 type="link"
//               />
//             </Tooltip>
//           </Popconfirm>
//         </Space.Compact>
//       ),
//     },
//   ];

//   const onAdd = () => {
//     refDetail.current.create();
//   };

//   const onSearch = (e: any) => {
//     setLazyParams({
//       ...lazyParams,
//       page: 0,
//       search: e.target.value,
//     });
//   };

//   const onPage = (page: number, pageSize: number) => {
//     setLazyParams({
//       ...lazyParams,
//       page: page - 1,
//       size: pageSize,
//     });
//   };

//   ///Export excel
//   const onExport = async () => {
   
//   };


//   return (
//     <>
//       <Region>
//         <RegionTop>
//           <HeaderApp
//             icon={<IdcardOutlined className="text-2xl text-[#fff]" />}
//             title={t('common.menu.permission')}
//             group={t('common.menu.system')}
//             rightTop={
//               <Space>
//                 <Button
//                   icon={<PlusOutlined />}
//                   type="primary"
//                   onClick={onAdd}
//                   // disabled={!permission[PERMISSION_ACTION.create]}
//                 >
//                   {t('common.create')}
//                 </Button>
                
//               </Space>
//             }
//             rightBottom={
//               <Space>
//                 <Input placeholder={t('common.search')} onChange={onSearch} />
//               </Space>
//             }
//           />
//         </RegionTop>
//         <RegionCenter>
//           {/* <Table
//             bordered
//             rowKey="id"
//             size="small"
//             scroll={{ x: 'max-content', y: '100%' }}
//             pagination={{
//               responsive: true,
//               total: data?.totalRecord,
//               pageSize: lazyParams.size,
//               size: 'small',
//               current: lazyParams.page,
//               showTotal: (total) => (
//                 <Space size={'small'} style={{ height: '100%' }} align="center">
//                   <Typography.Text>
//                   {total > 0
//                       ? `${
//                           (lazyParams.page - 1) * lazyParams.size + 1
//                         } - ${Math.min(
//                           lazyParams.page * lazyParams.size,
//                           total
//                         )} / ${total}`
//                       : "0 / 0"}
//                   </Typography.Text>
//                 </Space>
//               ),
//               showSizeChanger: data?.totalRecord > 0,
//               pageSizeOptions: CommonPageSizeOptions,
//               onChange: onPage,
//             }}
//             columns={columns}
//             dataSource={data?.items}
//           /> */}
//         </RegionCenter>
//       </Region>
//       <WarehouseDetail ref={refDetail} orgs={orgs} />
//     </>
//   );
// }
