import { useEffect, useRef, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Button, Flex, Image, Input, Popconfirm, Select, Space, Table, Typography } from "antd";
import PageSizeOption from "@/components/PageSizeOptions";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import { ICustomer } from "#/entity";
import { ColumnType } from "antd/es/table";
import ButtonIcon from "@/components/ButtonIcon";
import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { no_image } from "@/assets/images";
import { useDebounce } from "@/router/hooks";
import CustomerDetail from "./detail";
import { PERMISSION_ACTION, ROUTE_NAME } from "@/_mock/assets";
import { usePermission } from "@/store/userStore";
import _ from "lodash";
import { deleteCustomer, internalCustomers } from "@/api/services/customerService";
import { GENDER_OPTIONS } from "#/enum";
import CustomerViewDetail from "./view";
import { formatDate } from "@/utils/format-date";
type PropKey = keyof ICustomer;

const Customer = () => {
  const { t } = useTranslation ();
  const { colorBorder, colorPrimary, colorTextLightSolid, colorBgContainer, colorBgElevated } = useThemeToken();
  const [columns, setColumns] = useState<ColumnType<ICustomer>[]>([]);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 20,
    search: "",
    limit: 1000,
  });
  const [data, setData] = useState<ICustomer[]>([]);
  const debouncedValue = useDebounce(lazyParams.search, 500);
  const refDetail = useRef<any>();
  const refView = useRef<any>();
  const permission: any = usePermission(ROUTE_NAME.Blog);

  const fetchBlog = async () => {
    try{
      setLoading(true);
      const res = await internalCustomers({limit: lazyParams.limit, search: debouncedValue});
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
        key: 'firstname',
        title: t('management.customer.field.firstname'),
        dataIndex: 'firstname',
        width: 100,
        render: (_, record) => <span className="line-clamp-2">{record.firstname}</span>
      },
      {
        key: 'lastname',
        title: t('management.customer.field.lastname'),
        dataIndex: 'lastname',
        width: 100,
        render: (_, record) => <span className="line-clamp-2">{record.lastname}</span>
      },
      {
        key: 'avatar',
        dataIndex: 'avatar',
        title: t("management.customer.field.avatar"),
        width: 150,
        render: (_, record) => (
          <div className="flex items-center rounded-full w-max h-max overflow-hidden">
            <Image src={record.avatar || no_image} width={60} className=" overflow-hidden rounded-full" />
          </div>
        )
      },
      {
        key: 'email',
        dataIndex: 'email',
        title: t('management.customer.field.email'),
        width: 200,
        render: (_, record) => <span className="line-clamp-2 text-blue">{record.email}</span>
      },
      {
        key: 'phone',
        dataIndex: 'phone',
        title: t("management.customer.field.phone"),
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.phone || "xxxx.xxx.xxx"}</span>
      },
      {
        key: 'gender',
        dataIndex: 'gender',
        title: t("management.customer.field.gender"),
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
        title: t("management.customer.field.date_of_birth"),
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{formatDate(record.date_of_birth?.toString() || "")}</span>
      },
      {
        key: 'level',
        dataIndex: 'level',
        title: t("management.customer.field.level"),
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.level}</span>
      },
       {
        key: 'provider',
        dataIndex: 'provider',
        title: t("management.customer.field.provider"),
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.provider}</span>
      },
      {
        key: 'action',
        title: t('common.action'),
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space key={record.id}>
            <ButtonIcon typeIcon="view" disabled={!permission[PERMISSION_ACTION.view]} onClick={() => onView(record)} />
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

  const onView = (formValue: ICustomer) => {
    refView.current.view({ ...formValue })
  }

  const onCreate = () => {
    refDetail.current.create()
  };
  
  const onEdit = (formValue: ICustomer) => {
    refDetail.current.update({ ...formValue })
  };

  const onDelete = async (formValue: ICustomer) => {
    if(!formValue.id) return;
    try {
      setLoading(true);
      const res = await deleteCustomer(formValue.id);
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
                  {t('management.customer.create')}
                </Button>
              </Space>
              <Space>
                <Input placeholder={t('common.search')} suffix={<SearchOutlined className="text-gray-400" /> } onChange={(e) => onChangeSearch(e.target.value)} />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.hide_column')} 
                  mode="multiple"
                  maxTagCount={1}
                  options={Object.keys(t('management.customer.field', { returnObjects: true })).map((key) => ({
                    value: key,
                    label: t(`management.customer.field.${key}`),
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
        <CustomerDetail 
          ref={refDetail} 
          reload={reload}
        />
        <CustomerViewDetail 
          ref={refView} 
          reload={reload}
        />
      </RegionCenter>
    </Region>
  );
};

export default Customer;
