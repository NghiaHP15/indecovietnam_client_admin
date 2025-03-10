import { Avatar, Button, Input, notification,  Space,  Typography } from 'antd';
import { CommonPageSizeOptions } from '#/enum';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useCallback,  useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Supplier } from '#/entity';
import 'jspdf-autotable';
import Region, { RegionCenter, RegionTop } from '@/layouts/_common/Region';
import HeaderApp from '@/components/header-app';
import { GlobalOutlined, SwapOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { usePermission } from '@/store/userStore';
import { PERMISSION_ACTION, ROUTE_NAME } from '@/_mock/assets';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import emptyImage from "@/assets/images/empty_data.png"
import venderService from '@/api/services/venderService';
export default function VendorScreen() {

  const { t } = useTranslation();

  const permission: any = usePermission(ROUTE_NAME.SupplierManage);

  const queryClient = useQueryClient();

  const [lazyParams, setLazyParams] = useState<any>({
    page: 1,
    size: 20,
    keyword: 'name',
    keywordFormat: '',
  });

  const query = {
    getVendor: useQuery({
      queryKey: ['getVendor', lazyParams],
      queryFn: () => venderService.internalVendors(lazyParams),
      retry: 3,
    }),
    syncVendor: useQuery({
      queryKey: ['syncVendor'],
      queryFn: () => venderService.asyncVendors(),
      enabled: false,
    })
  }

  const columns: ColumnsType<Supplier> = [
    {
      title: t('common.no.'),
      dataIndex: 'STT',
      width: 100,
      align: 'center',
      render: (_, __, index) => <div>{(lazyParams.page - 1) * lazyParams.size + index + 1}</div>,
    },
    {
      title: t('category.vendor.name'),
      dataIndex: 'name',
    }
  ];

  const onAsync = async () => {
    const res = await query.syncVendor.refetch();
    if(!!res){
      notification.success({
        message: t('common.success'),
        duration: 3,
      });
      reload();
    }
  };
  
  const reload = () => {
    queryClient.invalidateQueries()
  }

  const onSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setLazyParams({
        ...lazyParams,
        page: 1,
        keywordFormat: e.target.value,
      });
    }, 500),
    [],
  );

  const onPage = (page: number, size: number) => {
    setLazyParams({
      ...lazyParams,
      page,
      size,
    });
  };

  return (
    <>
      <Region>
        <RegionTop>
          <HeaderApp
            icon={<GlobalOutlined className="text-2xl text-[#fff]" />}
            title={t('common.menu.manage_provider')}
            group={t('common.menu.category')}
            rightTop={
              <Space>
                <Input placeholder={t('common.search')} onChange={onSearch} />
                <Button
                  icon={<SwapOutlined />}
                  loading={query.syncVendor.isLoading}
                  type="primary"
                  onClick={onAsync}
                  disabled={!permission[PERMISSION_ACTION.create]}
                >
                  {t('common.synchronized')}
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
            scroll={{ x: 'max-content', y: '100%' }}
            pagination={{
              responsive: true,
              total: query.getVendor.data?.length,
              pageSize: lazyParams.size,
              size: 'small',
              current: lazyParams.page,
              showTotal: (total) => (
                <Space size={'small'} style={{ height: '100%' }} align="center">
                  <Typography.Text>
                    {total > 0
                      ? `${(lazyParams.page - 1) * lazyParams.size + 1} - ${Math.min(
                          lazyParams.page * lazyParams.size,
                          total,
                        )} / ${total}`
                      : '0 / 0'}
                  </Typography.Text>
                </Space>
              ),
              showSizeChanger: query.getVendor.data?.length.data?.totalRecord > 0,
              pageSizeOptions: CommonPageSizeOptions,
              onChange: onPage,
            }}
            columns={columns}
            dataSource={query.getVendor.data}
            loading={query.getVendor.data?.length.isLoading}
            locale={{
              emptyText: (<Avatar size={200} src={emptyImage} />)
            }}
          />
        </RegionCenter>
      </Region>
    </>
  );
}
