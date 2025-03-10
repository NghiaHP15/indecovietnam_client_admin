// import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
// import _ from 'lodash';
// import {
//   Button,
//   Col,
//   Form,
//   Input,
//   Modal,
//   Popconfirm,
//   Row,
//   Typography,
//   Flex,
//   notification,
//   Select,
// } from 'antd';
// import { useTranslation } from 'react-i18next';
// import { Supplier, Warehouse } from '#/entity';
// import { MODE } from '#/enum';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import warehouseService from '@/api/services/warehouseService';

// type Props = {
//   readOnly?: boolean;
//   orgs: any[];
// };

// const WarehouseDetail = forwardRef(({ readOnly, orgs }: Props, ref) => {
//   const { t } = useTranslation();

//   const refDetail = useRef<any>();

//   const [loading, setLoading] = useState(false);

//   const [isOpen, setIsOpen] = useState(false);

//   const refMode = useRef<{ data?: Supplier; mode: string }>({
//     data: undefined,
//     mode: MODE.CREATE,
//   });

//   useImperativeHandle(ref, () => ({
//     create: () => {
//       refMode.current = {
//         mode: MODE.CREATE,
//       };
//       setIsOpen(true);
//     },
//     update: (_data: Supplier) => {
//       refMode.current = {
//         data: _data,
//         mode: MODE.UPDATE,
//       };
//       setIsOpen(true);
//     },
//   }));

//   const afterOpenChange = (_open: boolean) => {
//     if (_open) {
//       if (refMode.current?.mode == MODE.CREATE) {
//         refDetail.current.create();
//       }
//       if (refMode.current?.mode == MODE.UPDATE) {
//         refDetail.current.update(refMode.current?.data);
//       }
//     }
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   const confirmClose = () => {
//     setIsOpen(false);
//   };

//   const submitProject = () => {
//     refDetail.current.submit();
//   };

//   return (
//     <>
//       <Modal
//         title={t(refMode.current?.mode == MODE.CREATE ? 'common.create' : 'common.update', )}
//         open={isOpen}
//         destroyOnClose
//         onCancel={closeModal}
//         afterOpenChange={afterOpenChange}
//         styles={{
//           body: { maxHeight: 'calc(100vh - 200px)' },
//         }}
//         width={800}
//         centered
//         footer={[
//           <Flex justify="end" gap={5} className="mr-5">
//             <Popconfirm
//               placement="topRight"
//               title={t('common.confirm.close_request')}
//               description={t('common.confirm.description_close_request')}
//               onConfirm={confirmClose}
//             >
//               <Button key="close-request" loading={loading} type="primary" danger>
//                 {t('common.cancel')}
//               </Button>
//             </Popconfirm>
//             ,
//             <Button
//               key="submit"
//               type="primary"
//               onClick={submitProject}
//               disabled={refMode.current.mode === MODE.VIEW}
//               loading={loading}
//             >
//               {t('common.save')}
//             </Button>
//             ,
//             <Button key="close" loading={loading} onClick={closeModal}>
//               {t('common.close')}
//             </Button>
//             ,
//           </Flex>,
//         ]}
//       >
//         <WarehouseDetailForm
//           ref={refDetail}
//           setLoading={setLoading}
//           closeModal={closeModal}
//           readOnly={readOnly}
//           orgs={orgs}
//         />
//       </Modal>
//     </>
//   );
// });

// export default WarehouseDetail;

// type FormProps = {
//   readOnly?: boolean;
//   setLoading: (i: boolean) => void;
//   closeModal: () => void;
//   orgs: any[];
// };

// const emptyParameter: Warehouse = {
//   name: '',
//   description: '',
//   isMain: '',
// };

// type ErrorWarehouse = {
//   [key: string]: string | null;
// };

// const emptyValidate: ErrorWarehouse = {
//   name: '',
//   description: '',
//   isMain: '',
// };

// type PropKey = keyof Warehouse;

// export const WarehouseDetailForm = forwardRef(
//   ({ readOnly, setLoading, closeModal }: FormProps, ref) => {

//     const queryClient = useQueryClient();

//     const { t } = useTranslation();

//     const [mode, setMode] = useState<string>(MODE.CREATE);

//     const [param, setParam] = useState<Warehouse>(emptyParameter);

//     const [errors, setErrors] = useState<ErrorWarehouse>(emptyValidate);

//     useImperativeHandle(ref, () => ({
//       create: () => {
//         setMode(MODE.CREATE);
//       },
//       update: (data: Warehouse) => {
//         setParam(data);
//         setMode(MODE.UPDATE);
//       },
//       submit: submitProject,
//       reset: resetData,
//     }));

//     const { mutateAsync: updateWarehouse } = useMutation({
//       mutationFn: async (data: Warehouse) =>
//         warehouseService.updateWarehouse({ id :data.id as string, data }),
//     });

//     const { mutateAsync: createWarehouse } = useMutation({
//       mutationFn: async (data: Warehouse) => warehouseService.createWarehouse(data),
//     });


//     const submitProject = async () => {
//       // let _payload: Warehouse = _.cloneDeep(param);
//       // let isValid = await performValidate([], _payload);
//       // if (!isValid) return;
//       // _payload.isMain = Number(_payload.isMain) || 0
//       // setLoading(true);
//       // try {
//       //   if (mode === MODE.CREATE) {
//       //     await createWarehouse(_payload);
//       //   } else if (mode === MODE.UPDATE) {
//       //     await updateWarehouse(_payload);
//       //   }
//       //   queryClient.invalidateQueries({ queryKey: ['warehouse'] });
//       //   if (closeModal) closeModal();
//       //   notification.success({
//       //     message: t('common.success'),
//       //     duration: 2,
//       //   });
//       // } catch (error) {
//       //   console.error('error', error);
//       // } finally {
//       //   setLoading(false);
//       // }
//     };

//     const resetData = () => {
//       setParam(emptyParameter);
//     };

  

//     return (
//       <Form layout="vertical">
//         <Row gutter={24}>
//           <Col span={24} className="mb-3">
//             <Typography.Text className="font-bold">{t('category.warehouse.title')}</Typography.Text>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               label={"Tên tài khoản"}
//               required
//               validateStatus={errors['name'] ? 'error' : ''}
//               help={errors['name']}
//             >
//               <Input
//                 placeholder={t('category.warehouse.name')}
//                 disabled={readOnly || mode == MODE.VIEW}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item label={"Tên người dùng"}    
//               required
//               validateStatus={errors['isMain'] ? 'error' : ''}
//               help={errors['isMain']}>
//               <Input/>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item label={"Địa chỉ"}
//               required
//               validateStatus={errors['description'] ? 'error' : ''}
//               help={errors['description']}>
//               <Input
//                 placeholder={t('category.warehouse.description')}
//                 value={param?.description}
//                 disabled={readOnly || mode == MODE.VIEW}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item label={"Cấp tài khoản"}
//               required
//               validateStatus={errors['description'] ? 'error' : ''}
//               help={errors['description']}>
//               <Select
//               options={[
//                 {
//                   value:""
//                 }
//               ]}
                
//               />
//             </Form.Item>
//           </Col>
//         </Row>
//       </Form>
//     );
//   },
// );
