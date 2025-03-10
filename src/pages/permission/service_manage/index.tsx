import {
  Avatar,
  Button,
  Input,
  notification,
  Popconfirm,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { CommonPageSizeOptions } from '#/enum';
import Table, { ColumnsType } from 'antd/es/table';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'jspdf-autotable';
import Region, { RegionCenter, RegionTop } from '@/layouts/_common/Region';
import HeaderApp from '@/components/header-app';
import { DeleteOutlined, EditOutlined, MergeOutlined, PlusOutlined } from '@ant-design/icons';
import { usePermission } from '@/store/userStore';
import { PERMISSION_ACTION, ROUTE_NAME } from '@/_mock/assets';
// import InventoryDetail from './detail';
import emptyImage from '@/assets/images/empty_data.png';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import serviceService from '@/api/services/serviceService';
import ServiceDetail from './detail';

export default function InventoryScreen() {
  const { t } = useTranslation();

  const permission: any = usePermission(ROUTE_NAME.Inventory);

  const [lazyParams, setLazyParams] = useState<any>({
    page: 0,
    size: 20,
    keyword: '',
    keywordFormat: '',
    warehouseId: '',
  });

  const queryClient = useQueryClient();

  const refDetail = useRef<any>();

  const query = {
    getService: useQuery({
      queryKey: ['getService'],
      queryFn: () => serviceService.internalService(lazyParams),
    }),
  };

  const mutation = {
    deleteService: useMutation({
      mutationFn: serviceService.deleteService,
      onSuccess: () => {
        onLoad();
      },
    }),
  };

  const onLoad = () => {
    queryClient.invalidateQueries();
  };

  const onEdit = (rowData: any) => () => {
    refDetail.current.update(rowData);
  };

  const onDelete = (_rowData: any) => async () => {
    const res = await mutation.deleteService.mutateAsync(_rowData.id);
    if (res) {
      notification.success({
        message: t('common.success'),
        duration: 3,
      });
    }
  };

  const columns: ColumnsType = [
    {
      title: t('common.no.'),
      dataIndex: 'STT',
      width: 50,
      align: 'center',
      render: (_, __, index) => <div>{lazyParams.page * lazyParams.size + index + 1}</div>,
    },
    {
      title: t('category.service.name'),
      dataIndex: 'name',
      width: 150,
      align: 'center',
    },
    {
      title: t('category.service.description'),
      dataIndex: 'description',
      width: 200,
      align: 'center',
    },
    {
      title: t('category.service.public_key'),
      dataIndex: 'publicKey',
      width: 250,
      align: 'center',
      render: (_, record: any) => <div style={{width: 300}}><span >{record.publicKey}</span></div>
    },
    {
      title: t('category.service.private_key'),
      dataIndex: 'privateKey',
      width: 250,
      align: 'center',
      render: (_, record: any) => <div style={{width: 300}}><span >{record.privateKey}</span></div>
    },
    {
      width: 20,
      align: 'center',
      fixed: 'right',
      render: (_, record: any) => (
        <Space.Compact prefix="|">
          <Tooltip title={t('common.edit')}>
            <Button
              disabled={!permission[PERMISSION_ACTION.update]}
              color="primary"
              type="link"
              icon={<EditOutlined />}
              onClick={onEdit(record)}
              loading={mutation.deleteService.isPending}
            />
          </Tooltip>
          <Popconfirm
            title={t('common.title_delete')}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
            placement="left"
            onConfirm={onDelete(record)}
          >
            <Tooltip title={t('common.delete')}>
              <Button
                color="danger"
                // disabled={!permission[PERMISSION_ACTION.delete]}
                icon={<DeleteOutlined />}
                variant="text"
                loading={mutation.deleteService.isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];

  const onAdd = () => {
    refDetail.current.create();
  };

  const onSearch = (e: any) => {
    setLazyParams({
      ...lazyParams,
      page: 0,
      search: e.target.value,
    });
  };

  const onPage = (page: number, pageSize: number) => {
    setLazyParams({
      ...lazyParams,
      page: page - 1,
      size: pageSize,
    });
  };

  return (
    <>
      <Region>
        <RegionTop>
          <HeaderApp
            icon={<MergeOutlined className="text-2xl text-[#fff]" />}
            title={t('common.menu.inventory')}
            group={t('common.menu.storage')}
            rightTop={
              <Space>
                <Input placeholder={t('common.search')} onChange={onSearch} />
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={onAdd}
                  disabled={!permission[PERMISSION_ACTION.create]}
                >
                  {t('common.create')}
                </Button>
              </Space>
            }
            rightBottom={<Space></Space>}
          />
        </RegionTop>
        <RegionCenter>
          <Table
            bordered
            rowKey="id"
            size="small"
            locale={{
              emptyText: <Avatar size={200} src={emptyImage} />,
            }}
            scroll={{ x: 'max-content', y: '100%' }}
            pagination={{
              responsive: true,
              total: query.getService?.data?.length || 0,
              pageSize: lazyParams.size,
              size: 'small',
              // @ts-ignore
              current: lazyParams.page + 1,
              showTotal: (total) => (
                <Space size={'small'} style={{ height: '100%' }} align="center">
                  <Typography.Text>
                    {total > 0
                      ? `${lazyParams.page * lazyParams.size + 1} - ${Math.min(
                          (lazyParams.page + 1) * lazyParams.size,
                          total,
                        )} / ${total}`
                      : '0 / 0'}
                  </Typography.Text>
                </Space>
              ),
              showSizeChanger: query.getService?.data?.length > 0,
              pageSizeOptions: CommonPageSizeOptions,
              onChange: onPage,
            }}
            loading={query.getService?.isLoading}
            columns={columns}
            dataSource={query.getService?.data || []}
          />
        </RegionCenter>
      </Region>
      <ServiceDetail ref={refDetail} reload={onLoad} />
    </>
  );
}
