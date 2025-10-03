import { useEffect, useRef, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Button, Flex, Image, Input, Popconfirm, Select, Space, Table, Typography } from "antd";
import PageSizeOption from "@/components/PageSizeOptions";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import { IEmployee } from "#/entity";
import { ColumnType } from "antd/es/table";
import ButtonIcon from "@/components/ButtonIcon";
import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { no_image } from "@/assets/images";
import { useDebounce } from "@/router/hooks";
import { PERMISSION_ACTION, ROUTE_NAME } from "@/_mock/assets";
import { usePermission } from "@/store/userStore";
import _ from "lodash";
import { GENDER_OPTIONS } from "#/enum";
import { deleteEmployee, internalEmployees } from "@/api/services/employeeService";
import EmployeeDetail from "./detail";
import { formatDate } from "@/utils/format-date";
type PropKey = keyof IEmployee;

const Customer = () => {
  const { t } = useTranslation ();
  const { colorBorder, colorPrimary, colorTextLightSolid, colorBgContainer, colorBgElevated } = useThemeToken();
  const [columns, setColumns] = useState<ColumnType<IEmployee>[]>([]);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 20,
    search: "",
    limit: 1000,
  });
  const [data, setData] = useState<IEmployee[]>([]);
  const debouncedValue = useDebounce(lazyParams.search, 500);
  const refDetail = useRef<any>();
  // const refView = useRef<any>();
  const permission: any = usePermission(ROUTE_NAME.Blog);

  const fetchBlog = async () => {
    try{
      setLoading(true);
      const res = await internalEmployees({limit: lazyParams.limit, search: debouncedValue});
      if(res){
        setData(res)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlog();
  }, [lazyParams.limit, debouncedValue]);

  useEffect(() => {
    setColumns([
      {
        key: 'index',
        title: '#',
        render: (_, __, index) => <span>{index + 1}</span>,
        width: 50,
      },
      {
        key: 'fullname',
        title: t('management.employee.field.fullname'),
        dataIndex: 'fullname',
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.fullname}</span>
      },
      {
        key: 'avatar',
        dataIndex: 'avatar',
        title: t("management.employee.field.avatar"),
        width: 150,
        render: (_, record) => (
          <div className="flex items-center rounded-full w-max h-max overflow-hidden">
            <Image src={record.avatar || no_image} width={60} className=" overflow-hidden rounded-full" />
          </div>
        )
      },
      {
        key: 'email',
        title: t('management.employee.field.email'),
        dataIndex: 'email',
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.email}</span>
      },
      {
        key: 'phone',
        dataIndex: 'phone',
        title: t('management.employee.field.phone'),
        width: 100,
        render: (_, record) => <span className="line-clamp-2 text-blue">{record.phone}</span>
      },
      {
        key: 'gender',
        dataIndex: 'gender',
        title: t("management.employee.field.gender"),
        width: 150,
        render: (_, record) => 
          <span 
            className={`${record.gender === 'male' ? 'text-blue' : record.gender === 'female' ? 'text-error' : 'text-white'} line-clamp-2 px-3 py-1 rounded-md w-max`}
          >
            {record.gender === GENDER_OPTIONS.MALE ? t('common.male') : record.gender === GENDER_OPTIONS.FEMALE ? t('common.female') : t('common.other')}
          </span>
      },
      {
        key: 'date_of_birth',
        dataIndex: 'date_of_birth',
        title: t("management.employee.field.date_of_birth"),
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{formatDate(record.date_of_birth?.toString() || "")}</span>
      },
      {
        key: 'status_active',
        dataIndex: 'status_active',
        title: t("management.employee.field.status_active"),
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.status_active? t('management.employee.status_active.active'): t('management.employee.status_active.inactive')}</span>
      },
      {
        key: 'position',
        dataIndex: 'position',
        title: t("management.employee.field.position"),
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.position}</span>
      },
      {
        key: 'role',
        dataIndex: 'role',
        title: t("management.employee.field.role"),
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record?.role?.name}</span>
      },
      {
        key: 'action',
        title: t('common.action'),
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space key={record.id}>
            {/* <ButtonIcon typeIcon="view" disabled={!permission[PERMISSION_ACTION.view]} onClick={() => onView(record)} /> */}
            <ButtonIcon typeIcon="edit" disabled={!permission[PERMISSION_ACTION.update]} onClick={() => onEdit(record)} />
            <Popconfirm
              placement="bottomRight"
              title={t("common.title_delete")}
              okText={t("common.ok")}
              onConfirm={() => onDelete(record)}
              cancelText={t("common.cancel")}
            >
              <ButtonIcon typeIcon="delete" disabled={!permission[PERMISSION_ACTION.delete]} />
            </Popconfirm>
          </Space>
        ),
      },
    ])
  }, [t]);

  const reload = () => {
    fetchBlog();
  };

  // const onView = (formValue: IEmployee) => {
  //   refView.current.view({ ...formValue })
  // }

  const onCreate = () => {
    refDetail.current.create()
  };
  
  const onEdit = (formValue: IEmployee) => {
    refDetail.current.update({ ...formValue })
  };

  const onDelete = async (formValue: IEmployee) => {
    if(!formValue.id) return;
    try {
      setLoading(true);
      const res = await deleteEmployee(formValue.id);
      if(res) reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const changePageSize = (pageSize: number) => {
    setLazyParams({
      ...lazyParams,
      size: pageSize,
    });
  };

  const onChangeHide = (value: (PropKey | undefined)[]) =>
    setColumns(
      columns.map(item => ({
        ...item,
        hidden: value.includes(item.key as PropKey),
    }))
  );

  const onChangeSearch = (value: string) => {
    setLazyParams({
      ...lazyParams,
      search: value,
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
    <Region>
      <RegionCenter>
        <div style={{ backgroundColor: colorBgContainer, padding: 20 }} className="rounded-lg overflow-auto h-full">
          <Flex vertical className="h-full">
            <Flex justify="space-between" className="mb-5 p-3 rounded-md" style={{ backgroundColor: colorBgElevated }}>
              <Space>
                <Button 
                  type="primary" 
                  onClick={onCreate} 
                  icon={<PlusOutlined className="text-white"/>} 
                  disabled={!permission[PERMISSION_ACTION.create]}
                >
                  {t('management.employee.create')}
                </Button>
              </Space>
              <Space>
                <Input placeholder={t('common.search')} suffix={<SearchOutlined className="text-gray-400" /> } onChange={(e) => onChangeSearch(e.target.value)} />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.hide_column')} 
                  mode="multiple"
                  maxTagCount={1}
                  options={Object.keys(t('management.employee.field', { returnObjects: true })).map((key) => ({
                    value: key,
                    label: t(`management.employee.field.${key}`),
                  }))}
                  onChange={(value) => onChangeHide(value)}
                />
              </Space>
            </Flex>
            <Table
              rowKey="id"
              size="small"
              className="relative"
              style={{ borderColor: colorBorder }}
              scroll={{ x: 'w-full' }}
              loading={loading}
              pagination={{
                responsive: true,
                total: data.length,
                itemRender(page, type, originalElement) {
                  if (type === "prev") {
                    return <Button size='small' className='mr-1 ml-2 !rounded-sm' style={{backgroundColor: colorPrimary, color: colorTextLightSolid, border: "none"}}  icon={<LeftOutlined style={{ fontSize: '12px' }} />}></Button>;
                  }
                  if (type === "next") {
                    return <Button size='small' className='ml-1 mr-2 !rounded-sm' style={{backgroundColor: colorPrimary, color: colorTextLightSolid, border: "none"}}  icon={<RightOutlined style={{ fontSize: '12px' }} />}></Button>;
                  }
                  if (type === "page") {
                    return <a>{page}</a>;
                  }
                  return originalElement;
                },
                pageSize: lazyParams.size,
                size: 'small',
                current: lazyParams.page + 1,
                showTotal: (total) => (
                  <div className="absolute left-2">
                    <Space>
                      <Typography.Text className="text-sm font-normal">
                        {t('common.showing')}{' '}
                        {total > 0
                          ? `${lazyParams.page * lazyParams.size + 1} - ${Math.min(
                              (lazyParams.page + 1) * lazyParams.size,
                              total,
                            )} (${total})`
                          : '0 / 0'}
                      </Typography.Text>
                      <PageSizeOption pageSize={lazyParams.size} onChange={changePageSize} />
                    </Space>
                  </div>
                ),
                onChange: onPage,
              }}
              columns={columns}
              dataSource={data}
            />
          </Flex>
        </div>
        <EmployeeDetail 
          ref={refDetail} 
          reload={reload}
        />
      </RegionCenter>
    </Region>
  );
};

export default Customer;
