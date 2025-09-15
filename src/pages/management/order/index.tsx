import { useEffect, useRef, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Button, ConfigProvider, Dropdown, Flex, Input, MenuProps, Select, Space, Table, Tabs, Typography } from "antd";
import PageSizeOption from "@/components/PageSizeOptions";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import { IOrder } from "#/entity";
import { ColumnType } from "antd/es/table";
import ButtonIcon from "@/components/ButtonIcon";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import Icons from "@/assets/icons";
import { useDebounce } from "@/router/hooks";
import OrderDetail from "./detail";
import { PERMISSION_ACTION, ROUTE_NAME } from "@/_mock/assets";
import { usePermission } from "@/store/userStore";
import _ from "lodash";
import { ORDER_STATUS, PAYMENT_STATUS } from "#/enum";
import { internalOrders, updateOrder } from "@/api/services/orderService";
import dayjs from "dayjs";
import { fCurrency } from "@/utils/format-number";
import DetailViewOrder from "./view";

type PropKey = keyof IOrder;

const Gallery = () => {
  const { t } = useTranslation ();
  const { colorBorder, colorPrimary, colorTextLightSolid, colorBgContainer, colorBgElevated, colorTextBase } = useThemeToken();
  const [columns, setColumns] = useState<ColumnType<IOrder>[]>([]);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 20,
    search: "",
    status: ORDER_STATUS.PENDING,
    limit: 1000,
  });
  const [data, setData] = useState<IOrder[]>([]);
  const debouncedValue = useDebounce(lazyParams.search, 500);
  const refDetail = useRef<any>();
  const refDetailView = useRef<any>();
  const permission: any = usePermission(ROUTE_NAME.Gallery);

  const fetchGallery = async () => {
    try{
      setLoading(true);
      const res = await internalOrders({limit: lazyParams.limit, search: debouncedValue, status: lazyParams.status});
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
    fetchGallery();
  }, [lazyParams.limit, lazyParams.status, debouncedValue]);

  useEffect(() => {
    setColumns([
      {
        key: 'index',
        title: '#',
        render: (_, __, index) => <span>{index + 1}</span>,
        width: 50,
      },
      {
        key: 'txnRef',
        title: t('management.order.field.txnref'),
        dataIndex: 'txnRef',
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.txnRef}</span>
      },
      {
        key: 'order_date',
        title: t('management.order.field.order_date'),
        dataIndex: 'order_date',
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{dayjs(record.order_date).format('DD/MM/YYYY')}</span>
      },
      {
        key: 'total_amount',
        title: t('management.order.field.total_amount'),
        dataIndex: 'total_amount',
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{fCurrency(record.total_amount)}</span>
      },
      {
        key: 'status',
        title: t('management.order.field.status'),
        dataIndex: 'status',
        width: 150,
        render: (_, record) => {
          const result = ORDER_STATUS.list.find(item => item.value === record.status)
          const items: MenuProps['items'] = ORDER_STATUS.list.map(item => {
            return ({
              key: item.value,
              label: (
                <div style={{background: item.style.bg, color: item.style.color}} className={"flex items-center justify-center px-3 py-1 rounded-md w-full font-roboto "}>{t(item.label)}</div>
              ),
              onClick: () => onSelect(item.value, 'status', record)
            })
          })
          return (
            <Dropdown trigger={['click']} menu={{ items }}>
              <button style={{background: result?.style.bg, color: result?.style.color}} className={`flex items-center justify-center px-3 py-1 rounded-md font-roboto`}>{t(`${result?.label}`)}</button>
            </Dropdown>
          )
        }
      },
      {
        key: 'payment_status',
        title: t('management.order.field.payment_status'),
        dataIndex: 'payment_status',
        width: 150,
        render: (_, record) => {
          const result = PAYMENT_STATUS.list.find(item => item.value === record.payment_status)
          const items: MenuProps['items'] = PAYMENT_STATUS.list.map(item => {
            return ({
              key: item.value,
              label: (
                <div style={{background: item.style.bg, color: item.style.color}} className={"flex items-center justify-center px-3 py-1 rounded-md w-full font-roboto"}>{t(item.label)}</div>
              ),
              onClick: () => onSelect(item.value, 'payment_status',  record)
            })
          })
          return (
            <Dropdown trigger={['click']} menu={{ items }}>
              <button style={{color: result?.style.color, background: result?.style.bg}} className={`flex items-center justify-center px-3 py-1 rounded-md font-roboto`}>{t(`${result?.label}`)}</button>
            </Dropdown>
          )
        }
      },
      {
        key: 'paymentmethod',
        title: t('management.order.field.paymentmethod'),
        dataIndex: 'paymentmethod',
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.paymentmethod}</span>
      },
      {
        key: 'customer',
        title: t('management.order.field.customer'),
        dataIndex: 'customer',
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record?.customer?.firstname + ' ' + record?.customer?.lastname}</span>
      },
      {
        key: 'address',
        title: t('management.order.field.address'),
        dataIndex: 'address',
        width: 250,
        render: (_, record) => <span className="line-clamp-2">{record?.address?.address_line + ' ' + record?.address?.ward + ' ' + record?.address?.district + ' ' + record?.address?.city}</span>
      },
      {
        key: 'note',
        title: t('management.order.field.note'),
        dataIndex: 'note',
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.note}</span>
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
          </Space>
        ),
      },
    ])
  }, [t, lazyParams.status]);

  const reload = () => {
    fetchGallery();
  };

  const onCreate = () => {
    refDetail.current.create();
  };
  
  const onView = (formValue: IOrder) => {
    refDetailView.current.view({ ...formValue })
  };

  const onEdit = (formValue: IOrder) => {
    refDetail.current.update({ ...formValue })
  };

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

  const onSelect = async (value: string, field: string, data: any) => {
    const _param = _.cloneDeep(data);
    _param[field] = value;
    try {
      const res = await updateOrder(data.id, _param);
      if(res) reload();
    } catch (error) {
      console.error(error);
    }
  }

  const tabs = [
    {
      key: ORDER_STATUS.PENDING,
      label: t('management.order.order_status.pending'),
      Children: <></>
    },
    {
      key: ORDER_STATUS.PROCESSING,
      label: t('management.order.order_status.processing'),
      Children: <></>
    },
    {
      key: ORDER_STATUS.SHIPPED,
      label: t('management.order.order_status.shipped'),
      Children: <></>
    },
    {
      key: ORDER_STATUS.DELIVERED,
      label: t('management.order.order_status.delivered'),
      Children: <></>
    },
    {
      key: ORDER_STATUS.CANCELLED,
      label: t('management.order.order_status.cancelled'),
      Children: <></>
    }
  ]
  
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
                  {t('management.order.create')}
                </Button>
              </Space>
              <Space>
                <Input placeholder={t('common.search')} suffix={<Icons.Search /> } onChange={(e) => onChangeSearch(e.target.value)} />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.hide_column')} 
                  mode="multiple"
                  maxTagCount={1}
                  options={Object.keys(t('management.order.field', { returnObjects: true })).map((key) => ({
                    value: key,
                    label: t(`management.order.field.${key}`),
                  }))}
                  onChange={(value) => onChangeHide(value)}
                />
              </Space>
            </Flex>
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    itemColor: colorTextBase
                  },
                },
              }}
            >
            <Tabs 
              items={tabs} 
              style={{ color: colorTextBase }}
              activeKey={lazyParams.status}
              onChange={(key) => {
                setLazyParams({
                  ...lazyParams,
                  status: key
                })
              }}
            />
            </ConfigProvider>
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
        <OrderDetail
          ref={refDetail} 
          reload={reload}
        />
        <DetailViewOrder
          ref={refDetailView} 
          reload={reload}
        />
      </RegionCenter>
    </Region>
  );
};

export default Gallery;
