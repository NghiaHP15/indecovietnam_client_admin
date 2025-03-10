import { Avatar, Button, Input, notification, Popconfirm, Space, Tooltip, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Detail, RoleModalProps } from './detail.tsx';
import { IRoleGroup } from '#/entity.ts';
import { DEFAULT_USER, PERMISSION_ACTION, ROUTE_NAME } from '@/_mock/assets';
import { usePermission } from '@/store/userStore.ts';
import Region, { RegionCenter, RegionTop } from '@/layouts/_common/Region.tsx';
import HeaderApp from '@/components/header-app/index.tsx';
import { DeleteOutlined, EditOutlined, PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import roleService from '@/api/services/roleService.ts';
import { debounce } from 'lodash';
import emptyImage from "@/assets/images/empty_data.png"

const DEFAULT_ROLE_VALUE: IRoleGroup = {
  id: '',
  code: '',
  name: '',
  parentId: '',
  permission: [],
};


export default function RoleGroupPage() {
  const { t } = useTranslation();
  // const user = useUserInfo();
  const queryClient = useQueryClient();
  const permission: any = usePermission(ROUTE_NAME.user_groups_roles);
  const [roleModalPros, setRoleModalProps] = useState<RoleModalProps>({
    formValue: { ...DEFAULT_ROLE_VALUE },
    title: '',
    show: false,
    isUpdate: false,
    onCancel: () => {
      setRoleModalProps((prev) => ({ ...prev, show: false }));
    },
  });
  const [lazyParams, setLazyParams] = useState<any>({
      page: 1,
      size: 20,
      keyword: '',
      keywordFormat: '',
  });

  const query = {
    role: useQuery({
      queryKey: ["Role"],
      queryFn: () => roleService.internalRoles()
    })
  }
  const mutation = {
    deleteRole: useMutation({
      mutationFn: roleService.deleteRole,
      onSuccess: () => {
        notification.success({ message: t("common.success"), duration: 3 });
        loadData();
      }
    })
  }

  const loadData = () => {
    queryClient.invalidateQueries()
  }

  const deleteUserGroup = async (id: string) => {
    await mutation.deleteRole.mutateAsync(id)
  };
  const onCreate = () => {
    setRoleModalProps((prev) => ({
      ...prev,
      show: true,
      title: `${t('common.create')}`,
      formValue: {
        ...prev.formValue,
        ...DEFAULT_ROLE_VALUE,
        permission: DEFAULT_USER.permissions,
      },
      isUpdate: false,
    }));
  };
  const onEdit = (formValue: IRoleGroup) => {
    setRoleModalProps((prev) => ({
      ...prev,
      show: true,
      title: `${t('common.update')}`,
      formValue: { ...formValue, permission: formValue.permission ? JSON.parse(formValue.permission) : "" },
      isUpdate: true,
    }));
  };


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
    console.log(size);

    setLazyParams({
      ...lazyParams,
      page,
      size,
    });
  };

  const columns: ColumnsType = [
    {
      title: 'STT',
      dataIndex: 'STT',
      width: 50,
      align: 'center',
      render: (_, __, index) => <div>{(lazyParams.page - 1) * lazyParams.size + index + 1}</div>,
    },
    {
      title: t('system.role.name'),
      dataIndex: 'name',
      width: 350,
    },
    {
      title: t('system.role.code'),
      dataIndex: 'code',
      // width: 300,
    },
    {
      // title: t('common.action'),
      key: 'operation',
      align: 'center',
      width: 50,
      render: (_, record: any) => (
        <Space.Compact >
          <Tooltip title={t('common.edit')}>
            <Button 
              disabled={!permission[PERMISSION_ACTION.update]}
              color="primary"
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              loading={mutation.deleteRole.isPending}
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
                loading={mutation.deleteRole.isPending}
              />
          </Tooltip>
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];

  return (
    <>
      <Region>
        <RegionTop>
          <HeaderApp
            icon={<UsergroupAddOutlined className='text-2xl text-[#fff]' />}
            title={t("common.menu.role")}
            group={t("common.menu.system")}
            rightTop={<Space>
              <Input
                placeholder={t("common.search")}
                onChange={onSearch}
              />
              <Button
                icon={<PlusOutlined />}
                type="primary"
                disabled={!permission[PERMISSION_ACTION.create]}
                onClick={onCreate}>
                {t('common.create')}
              </Button>
            </Space>}
            rightBottom={<Space>
            </Space>}
          />
        </RegionTop>
        <RegionCenter>
          <Table
            bordered
            rowKey="id"
            size="small"
            scroll={{ x: 'max-content', y: "100%" }}
            columns={columns}
            loading={query?.role?.isLoading}
            dataSource={query?.role?.data || []}
            locale={{
              emptyText: (<Avatar size={200} src={emptyImage} />)
            }}
            pagination={{
              responsive: true,
              total: query.role.data?.totalRecord,
              pageSize: lazyParams.size,
              size: 'small',
              // @ts-ignore
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
              showSizeChanger: true,
              onChange: onPage,
            }}
          />
        </RegionCenter>
      </Region>
      <Detail 
        {...roleModalPros} 
        loadData={loadData} 
        // user={user} 
      />
    </>
  );
}
