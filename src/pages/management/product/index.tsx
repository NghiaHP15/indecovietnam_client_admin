import { useEffect, useRef, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Button, Checkbox, Flex, Image, Input, Popconfirm, Select, Space, Table, Typography } from "antd";
import PageSizeOption from "@/components/PageSizeOptions";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import { ColumnType } from "antd/es/table";
import ButtonIcon from "@/components/ButtonIcon";
import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { no_image } from "@/assets/images";
import { useDebounce } from "@/router/hooks";
import { PERMISSION_ACTION, ROUTE_NAME } from "@/_mock/assets";
import { usePermission } from "@/store/userStore";
import _ from "lodash";
import { IProduct, IProductVariant } from "#/entity";
import { deleteProduct, internalProducts, updateProduct } from "@/api/services/productService";
import { fCurrencyVN, fPercent } from "@/utils/format-number";
import { STATUS_PRODUCT } from "#/enum";
import ProductDetail from "./detail";

type PropKey = keyof IProduct;

const Product = () => {
  const { t } = useTranslation ();
  const { colorBorder, colorPrimary, colorTextLightSolid, colorBgContainer, colorBgElevated } = useThemeToken();
  const [columns, setColumns] = useState<ColumnType<IProduct>[]>([]);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 20,
    search: "",
    limit: 1000,
  });
  const [data, setData] = useState<IProduct[]>([]);
  const debouncedValue = useDebounce(lazyParams.search, 500);
  const refDetail = useRef<any>();
  const permission: any = usePermission(ROUTE_NAME.Product);

  const fetchProduct = async () => {
    try{
      setLoading(true);
      const res = await internalProducts({limit: lazyParams.limit, search: debouncedValue});
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
    fetchProduct();
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
        key: 'name',
        title: t('website.product.field.name'),
        dataIndex: 'title',
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.name}</span>
      },
      {
        key: 'slug',
        dataIndex: 'slug',
        title: t('website.product.field.slug'),
        hidden: true,
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.slug}</span>
      },
      {
        key: 'image',
        dataIndex: 'image',
        title: t("website.product.field.image"),
        width: 150,
        render: (_, record) => (
          <div className="flex items-center rounded-md w-max h-max overflow-hidden">
            <Image src={record.image || no_image} width={100}  className=" overflow-hidden" />
          </div>
        )
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: t('website.product.field.status'),
        width: 150,
        render: (_, record) =>(
        <Select 
          value={record.status} 
          options={STATUS_PRODUCT.list.map(item => ({label: t(item.label), value: item.value}))} 
          fieldNames={{ label: 'lable', value: 'value' }}
          onChange={(value) => onSelect(value, record)}
          />
        )
      },
      {
        key: 'featured',
        dataIndex: 'featured',
        title: t('website.product.field.featured'),
        width: 150,
        render: (_, record) => <Checkbox checked={record.featured} onChange={(e) => onCheck(e.target.checked, record)}/>
      },
      {
        key: 'description',
        dataIndex: 'description',
        title: t("website.product.field.description"),
        width: 250,
        hidden: true,
        render: (_, record) => <span className="line-clamp-2">{record.description}</span>
      },
      {
        key: 'category',
        dataIndex: 'productCategory',
        title: t("website.product.field.category"),
        width: 150,
        render: (_, record) => <span>{record.productCategory?.title}</span>
      },
      {
        key: 'min_price',
        dataIndex: 'min_price',
        title: t("website.product.field.min_price"),
        width: 150,
        render: (_, record) => <span>{fCurrencyVN(record.min_price)}</span>
      },
      {
        key: 'max_price',
        dataIndex: 'max_price',
        title: t("website.product.field.max_price"),
        width: 150,
        render: (_, record) => <span>{fCurrencyVN(record.max_price)}</span>
      },
      {
        key: 'action',
        title: t('common.action'),
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space key={record.id}>
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
    fetchProduct();
  };

  const onCreate = () => {
    refDetail.current.create()
  };
  
  const onEdit = (formValue: IProduct) => {
    refDetail.current.update({ ...formValue })
  };

  const onDelete = async (formValue: IProduct) => {
    if(!formValue.id) return;
    try {
      setLoading(true);
      const res = await deleteProduct(formValue.id);
      if(res) reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onCheck = async (value: boolean, data: any) => {
    const _param = _.cloneDeep(data);
    _param.featured = value;
    try {
      const res = await updateProduct(data.id, _param);
      if(res) reload();
    } catch (error) {
      console.error(error);
    }
  }

  const onSelect = async (value: string, data: any) => {
    const _param = _.cloneDeep(data);
    _param.status = value;
    try {
      const res = await updateProduct(data.id, _param);
      if(res) reload();
    } catch (error) {
      console.error(error);
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

  const renderExpandable = (record: IProductVariant[]) => {
    return (
      <div className="p-3">
        <Table
          rowKey="id"
          size="small"
          className="table-expanded"
          style={{ borderColor: colorBorder }}
          pagination={false}
          loading={loading}
          columns={[
            {
              key: 'index',
              title: '#',
              render: (_, __, index) => <span>{index + 1}</span>,
              width: 50,
            },
            {
              key: 'sku',
              title: t('website.product-variant.field.sku'),
              dataIndex: 'sku',
              width: 200,
              render: (_, record) => <span className="line-clamp-2">{record.sku}</span>
            },
            {
              key: 'image',
              dataIndex: 'image',
              title: t("website.product-variant.field.image"),
              width: 150,
              render: (_, record) => (
                <div className="flex items-center rounded-md w-max h-max overflow-hidden">
                  <Image src={record.image || no_image} width={100}  className=" overflow-hidden" />
                </div>
              )
            },
            Table.EXPAND_COLUMN,
            {
              key: 'size',
              dataIndex: 'size',
              title: t('website.product-variant.field.size'),
              width: 150,
              render: (_, record) => <span className="line-clamp-2">{record.size}</span>
            },
            {
              key: 'color',
              dataIndex: 'color',
              title: t("website.product-variant.field.color"),
              width: 150,
              render: (_, record) => {
                console.log(record);
                
                return (
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-[5px]`} style={{ backgroundColor: record?.color?.code }}></span>
                  <span className="line-clamp-2">{record?.color?.name}</span>
                </div>
              )
              }
            },
            {
              key: 'discount',
              dataIndex: 'discount',
              title: t("website.product-variant.field.discount"),
              width: 150,
              render: (_, record) => <span>{fPercent(record.discount)}</span>
            },
            {
              key: 'price',
              dataIndex: 'price',
              title: t("website.product-variant.field.price"),
              width: 150,
              render: (_, record) => <span>{fCurrencyVN(record.price)}</span>
            },
            {
              key: 'quantity_in_stock',
              dataIndex: 'quantity_in_stock',
              title: t("website.product-variant.field.quantity_in_stock"),
              width: 150,
              render: (_, record) => <span>{record.quantity_in_stock}</span>
            },
            {
              key: 'quanity_reserved',
              dataIndex: 'quanity_reserved',
              title: t("website.product-variant.field.quanity_reserved"),
              width: 150,
              render: (_, record) => <span>{record.quantity_reserved}</span>
            },
            {
              key: 'quantity_selled',
              dataIndex: 'quantity_selled',
              title: t("website.product-variant.field.quantity_selled"),
              width: 150,
              render: (_, record) => <span>{record.quantity_selled}</span>
            },
          ]}
          dataSource={record}
        />
      </div>
    );
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
                  {t('website.product.create')}
                </Button>
              </Space>
              <Space>
                <Input placeholder={t('common.search')} suffix={<SearchOutlined className="text-gray-400" /> } onChange={(e) => onChangeSearch(e.target.value)} />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.hide_column')} 
                  mode="multiple"
                  maxTagCount={1}
                  options={Object.keys(t('website.product.field', { returnObjects: true })).map((key) => ({
                    value: key,
                    label: t(`website.product.field.${key}`),
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
              expandable={{
                expandedRowRender: (record) => renderExpandable(record.variants || []),
                rowExpandable: (record) =>  (record.variants || []).length > 0,
                // expandRowByClick: true,
              }}
              columns={columns}
              dataSource={data}
              // onRow={() => ({
              //   style: {cursor: "pointer"}
              // })}
            />
          </Flex>
        </div>
        <ProductDetail 
          ref={refDetail} 
          reload={reload}
        />
      </RegionCenter>
    </Region>
  );
};

export default Product;
