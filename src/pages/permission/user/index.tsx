import { Button, Input, message, Popconfirm, Space, Tooltip, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import userService from '@/api/services/userService.ts';
import { UserInfo } from '#/entity.ts';
import { CommonPageSizeOptions } from '#/enum.ts';
import { usePermission } from '@/store/userStore.ts';
import 'jspdf-autotable';
import Region, { RegionCenter, RegionTop } from '@/layouts/_common/Region.tsx';
import HeaderApp from '@/components/header-app/index.tsx';
import { 
  DeleteOutlined,
  EditOutlined,
  // PlusOutlined, 
  UserOutlined } from '@ant-design/icons';
import UserDetail from './detail.tsx';
import RouterImport from './import';
import { PERMISSION_ACTION, ROUTE_NAME } from '@/_mock/assets.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';


export default function UserPage() {
  const { t } = useTranslation();
  const permission: any = usePermission(ROUTE_NAME.user_management);
  const [lazyParams, setLazyParams] = useState<any>({
    page: 1,
    size: 20,
    keyword: 'name',
    keywordFormat: '',
  });
  const [filter, setFilter] = useState<any>({ });

  const refDetail = useRef<any>()

  const refImport = useRef<any>()

  const queryClient = useQueryClient();
  
  const query = {
    users: useQuery({
      queryKey: ['GetUser'],
      queryFn: () => userService.getAllUser(),
    }),
  }

  
  const reload = () => {
    queryClient.invalidateQueries()
  }

  const deleteUserGroup = async (id: string) => {
    await userService.deleteUser(id);
    reload();
    message.success(t('common.action_success'));
  };

  const columns: ColumnsType = [
    {
      title: 'STT',
      dataIndex: 'STT',
      width: 50,
      align: 'center',
      render: (_, __, index) => <div>{index + 1}</div>,
    },
    {
      title: t('system.user.username'),
      dataIndex: 'userName',
      width: 150,
    },
    {
      title: t('system.user.fullname'),
      dataIndex: 'fullName',
      width: 200,
    },

    {
      title: t('system.user.address'),
      dataIndex: 'address',
      width: 250,
    },
    {
      title: t('system.user.role'),
      dataIndex: 'refRole',
      width: 150,
    },
    {
      title: t('common.action'),
      key: 'operation',
      align: 'center',
      fixed: "right",
      width: 50,
      render: (_, record: any) => (
        <Space.Compact>
          <Tooltip title={t('common.edit')}>
            <Button
              color="primary"
              type="link"
              icon={<EditOutlined />}
              disabled={!permission[PERMISSION_ACTION.update]}
              onClick={() =>
                onEdit({
                  ...record,
                })
              }
            />
          </Tooltip>
          <Popconfirm
            title={t('common.title_delete')}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
            placement="left"
            onConfirm={() => deleteUserGroup(record.id)}
          >
            <Tooltip title={t('common.delete')}>
              <Button 
              color="danger"
              disabled={!permission[PERMISSION_ACTION.delete]}
              icon={<DeleteOutlined />}
              variant="text"
              />
            </Tooltip>
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];
  // const onCreate = () => {
  //   refDetail.current.create()
  // };

  const onEdit = (formValue: UserInfo, _isChangePassWord = false) => {
    refDetail.current.update({
      ...formValue,
      password: ""
    })
  };

  const changeFilter = (prop: string, value: any) => {
    const _filter = structuredClone(filter);
    // @ts-ignore
    _filter[prop] = value;
    setFilter(_filter);
  };

  const onPage = (page: number, size: number) => {
    setLazyParams({
      ...lazyParams,
      page,
      size,
    });
  }
  return (
    <>
      <Region>
        <RegionTop>
          <HeaderApp
            icon={<UserOutlined className='text-2xl text-[#fff]' />}
            title={t("system.management.user")}
            group={t("common.menu.system")}
            rightTop={<Space>
              <Input
                placeholder={t("common.search")}
                value={filter.fullName}
                onChange={e => changeFilter('fullName', e.target.value)} />
              {/* <Button
                icon={<PlusOutlined />}
                type="primary"
                disabled={!permission[PERMISSION_ACTION.create]}
                onClick={onCreate}>
                {t('common.create')}
              </Button> */}
            </Space>}
            rightBottom={<Space></Space>}>
          </HeaderApp>
        </RegionTop>
        <RegionCenter className='mt-3'>
          <Table
            bordered
            rowKey="username"
            size="small"  
            scroll={{ x: 'max-content', y: '100%' }}
            columns={columns}
            dataSource={query?.users?.data?.items || []}
            pagination={{
              responsive: true,
              total: query?.users?.data?.totalRecord,
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
              showSizeChanger: query?.users?.data?.totalRecord > 0,
              pageSizeOptions: CommonPageSizeOptions,
              onChange: onPage,
             }}
          />
        </RegionCenter>
      </Region>
      <UserDetail
        ref={refDetail}
        reload={reload}
      />
      <RouterImport
        ref={refImport}
        reload={reload}
      />
    </>
  );
}
