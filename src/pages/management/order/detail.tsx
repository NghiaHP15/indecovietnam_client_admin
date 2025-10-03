import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE } from '#/enum';
import { ICustomer, IOrder, IProduct, IProductVariant } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { internalCustomers } from '@/api/services/customerService';
import { no_avatar, no_image } from '@/assets/images';
import { useDebounce } from '@/router/hooks';
import CustomerDetailOrder from './customer';
import ButtonIcon from '@/components/ButtonIcon';
import { v4 as uuidv4 } from 'uuid';
import { internalProducts } from '@/api/services/productService';
import { internalProductVariants } from '@/api/services/productVariantService';
import { fCurrencyVN } from '@/utils/format-number';
import { createOrder, updateOrder } from '@/api/services/orderService';
import { formatUTC } from '@/utils/format-date';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const OrderDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IOrder; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: IOrder) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: IOrder) => {
      refMode.current = {
        data: _data,
        mode: MODE.UPDATE,
      };
      setIsOpen(true);
    },
  }));

  const afterOpenChange = (_open: boolean) => {
    if (_open) {
      if (refMode.current?.mode == MODE.CREATE) {
        refDetail.current.create(refMode.current?.data);
      }
      if (refMode.current?.mode == MODE.UPDATE) {
        refDetail.current.update(refMode.current?.data);
      }
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    refDetail.current.reset();
  };

  const confirmClose = () => {
    setIsOpen(false);
  };

  const submitProject = () => {
    refDetail.current.submit();
  };

  return (
    <>
      <Modal
        title={t(refMode.current?.mode == MODE.CREATE ? 'common.create' : 'common.update')}
        open={isOpen}
        destroyOnClose
        onCancel={closeModal}
        afterOpenChange={afterOpenChange}
        styles={{
          body: { overflowY: 'scroll', flexGrow: 1 },
          content: { backgroundColor: colorBgContainer, display: "flex", flexDirection: "column", justifyContent: "space-between", height: room ? "100vh" : "100%" },
          header: { backgroundColor: colorBgContainer },
          footer: { backgroundColor: colorBgContainer },
        }}
        width={room ? "100vw" : "1000px"}
        centered
        footer={[
          <Space className="pr-3">
            <Button
              onClick={() => setRoom(!room)}
              icon={<ArrowsAltOutlined />}
            >
              {room ? t('common.reduce') : t('common.enlarge')}
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={submitProject}
              disabled={refMode.current.mode === MODE.VIEW}
              loading={loading}
            >
              {t('common.save')}
            </Button>
            <Button 
              key="close-request" 
              loading={loading} 
              onClick={confirmClose}
            >
              {t('common.close')}
            </Button>
          </Space>
        ]}
      >
        <OrderDetailForm
          ref={refDetail}
          setLoading={setLoading}
          reload={reload}
          closeModal={closeModal}
          readOnly={readOnly}
          isLink={isLink}
        />
      </Modal>
    </>
  );
});

export default OrderDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: IOrder = {
  customer: {
    id: '',
  },
  order_date: dayjs().format('YYYY-MM-DD'),
  total_amount: 0,
  paymentmethod: 'bank',
  address: {
    receiver_name: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    address_line: '',
  },
  products: [],
  note: '',
};
type ErrorOption = {
  customer: string | null;
  products: string | null;
  address: {
    receiver_name: string | null;
    phone: string | null;
    address: string | null;
  };
};

const emptyValidate: ErrorOption = {
  customer: null,
  products: null,
  address: {
    receiver_name: null,
    phone: null,
    address: null,
  }
};

type PropKey = keyof IOrder;

// type PropKeyItem = keyof IOrderItem;

export const OrderDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IOrder>(emptyParameter);

    const [customer, setCustomer] = useState<ICustomer[]>([]);

    const [product, setProduct] = useState<IProduct[]>([]);

    const [variant, setVariant] = useState<IProductVariant[]>([]);

    const [loadCustomer, setLoadCustomer] = useState<boolean>(false);

    const [loadProduct, setLoadProduct] = useState<boolean>(false);

    const [loadVariant, setLoadVariant] = useState<boolean>(false);

    const [searchProduct, setSearchProduct] = useState<string>('');

    const [searchVariant, setSearchVariant] = useState<string>('');

    const [searchCustomer, setSearchCustomer] = useState<string>('');

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const debouncedCustomer = useDebounce(searchCustomer, 500);

    const debouncedProduct = useDebounce(searchProduct, 500);

    const debouncedVariant = useDebounce(searchVariant, 500);

    const { colorTextDescription } = useThemeToken();

    const refCustomer = useRef<any>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoadProduct(true);
          setLoadVariant(true);
          const [productData, variantData] = await Promise.all([
            internalProducts({ limit: 1000, search: debouncedProduct }),
            internalProductVariants({ limit: 1000, product: debouncedVariant }),
          ])
          setProduct(productData);
          setVariant(variantData);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadProduct(false);
          setLoadVariant(false);
        }
      }

      fetchData();
    }, [debouncedProduct, debouncedVariant]);

    useEffect(() => {
      fetchCustomer();
    },[debouncedCustomer])

    const fetchCustomer = async () => {
      try {
        setLoadCustomer(true);
        const res = await internalCustomers({limit: 100, search: debouncedCustomer});
        if (res) {
          setCustomer(res);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadCustomer(false);
      }
    }
  
    const update = async (data: IOrder) => {
      let _data: IOrder = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IOrder) => {
      let _param: IOrder = _.cloneDeep({
        ...emptyParameter,
      });
      setParam(_param);
      setMode(MODE.CREATE);
    };

    useImperativeHandle(ref, () => ({
      create: create,

      update: update,

      submit: submitProject,

      reset: resetData,
    }));

    const performValidate = async (props: PropKey[], _currentParam: any) => {
      let _errors: ErrorOption = _.cloneDeep(errors);
      let _setParam = _currentParam ? _currentParam : param;
      
      if (props.length === 0) {
        for (const property in _errors) {
          props.push(property as PropKey);
        }
      }
      props.forEach((prop) => {
        switch (prop) {
          case 'customer':
            _errors[prop] = null;
            if (!_setParam[prop].id) {
              _errors[prop] = t('management.order.error.customer');
            }
            break;
          case 'products':
            _errors[prop] = null;
            if (_setParam[prop].length === 0) {
              _errors[prop] = t('management.order.error.products');
            }
            break;
          case "address":
            _errors.address = {
              receiver_name: null,
              phone: null,
              address: null,
            };

            if (!_setParam.address?.receiver_name) {
              _errors.address.receiver_name = t(
                "management.order.error.receiver_name"
              );
            }
            if (!_setParam.address?.phone) {
              _errors.address.phone = t("management.order.error.phone");
            }
            if (!_setParam.address?.address_line) {
              _errors.address.address = t(
                "management.order.error.address"
              );
            }
            break;
          default:
            break;
        }
      });
    
      setErrors(_errors);
    
      let isValid = true;

      if (_errors.customer) isValid = false;

      if (
        _errors.address.receiver_name ||
        _errors.address.phone ||
        _errors.address.address
      ) {
        isValid = false;
      }
      return isValid;
    };

    const submitProject = async () => {
      let _payload: any = _.cloneDeep(param);
      if(_payload.address.address_line) {
        const parts = _payload.address?.address_line?.split("-").map((p: string) => p.trim());
        _payload.address.address_line = parts?.[0] || "";
        _payload.address.ward = parts?.[1] || "";
        _payload.address.district = parts?.[2] || "";
        _payload.address.city = parts?.[3] || "";
      }
      const isValid = await performValidate([], _payload);
      if(!isValid) return;
      setLoading(true);
      try {
        if (mode === MODE.CREATE) {
          const res = await createOrder(_payload);
          if (res) {
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateOrder(_payload.id, _payload);
          if (res) {
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const resetData = () => {
      setParam(emptyParameter);
    };

    const reloadCustomer = () => {
      fetchCustomer();
    }

    const onCreate = () => {
      refCustomer.current.create();
    }

    const onChange = (value: string | boolean | null, field: PropKey) => {
      const _param: IOrder = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeReceiverName = (value: string | boolean | null, field: PropKey) => {
      const _param: IOrder = _.cloneDeep(param);
      (_param as any)[field].receiver_name = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangePhone = (value: string | boolean | null, field: PropKey) => {
      const _param: IOrder = _.cloneDeep(param);
      (_param as any)[field].phone = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeAddress = (value: string | null, field: PropKey) => {
      const _param: IOrder = _.cloneDeep(param);
      (_param as any)[field].address_line = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeCustomer = (value: any, field: PropKey) => {
      const _param: IOrder = _.cloneDeep(param);
      (_param as any)[field].id = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeDetailOrderProduct = (value: string, option: any, index: number) => {
      const _param: IOrder = _.cloneDeep(param);
      (_param as any).products[index].name = value;
      (_param as any).products[index].quantity = 0;
      (_param as any).products[index].total_price = 0;
      (_param as any).products[index].product_variant = null;
      setParam(_param);
      setSearchProduct('');
      setSearchVariant(option.id);
    };

    const onChangeDetailOrderVariant = (value: string, option: any, index: number) => {
      const _param: IOrder = _.cloneDeep(param);
      (_param as any).products[index].product_variant = {
        id: value,
        price: option?.price
      };
      (_param as any).products[index].quantity = 1;
      (_param as any).products[index].total_price = option?.price;
      (_param as any).total_amount = _param?.products.reduce((total, item) => total + Number(item.total_price), 0);
      setParam(_param);
    };

    const onChangeDetailOrderQuantity = (value: number, record: any, index: number) => {
      const _param: IOrder = _.cloneDeep(param);
      (_param as any).products[index].quantity = value;
      (_param as any).products[index].total_price = value * Number(record.product_variant?.price);
      (_param as any).total_amount = _param?.products.reduce((total, item) => total + Number(item.total_price), 0);
      setParam(_param);
    };

    const onAddProduct = () => {
      const _param = _.cloneDeep(param);
      _param?.products.push({ id: uuidv4(), product_variant: null,  quantity: 0, total_price: 0, name: '', slug: '' });
      setParam(_param);
      performValidate(['products'], _param);
    }

    const onDeleteItem = (record: any) => {
      const _param = _.cloneDeep(param);
      _param?.products.map((item, i) => item.id === record.id && _param?.products.splice(i, 1));
      setParam(_param);
    };
    
    return (
      <>
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={t('management.order.detail.customer')}
              required
              validateStatus={errors['customer'] ? 'error' : ''}
              help={errors['customer']}
            >
              <div className='flex items-center gap-2'>
                <Select
                  options={customer || []}
                  fieldNames={{ label: 'email', value: 'id' }}
                  value={param?.customer?.id}
                  placeholder={t('website.address.field.customer')}
                  showSearch
                  filterOption={false}
                  loading={loadCustomer}
                  onSearch={(e) => setSearchCustomer(e)}
                  disabled={readOnly || mode == MODE.VIEW}
                  onChange={(e) => onChangeCustomer(e, "customer")}
                  optionRender={(option) => {
                    const item: any = option.data;
                    return (
                      <div className='flex items-center gap-2'>
                        <Image
                          src={item.avatar || no_avatar}
                          width={35}
                          height={35}
                          preview={false}
                          fallback={item.image}
                          className='rounded-full'
                        />
                        <div className='flex flex-col'>
                          <span>{item.lastname + " " + item.firstname}</span>
                          <span className='font-sm' style={{ color: colorTextDescription }}>{item.email}</span>
                        </div>
                      </div>
                    )
                  }}
                />
                <Tooltip placement='top' title={t('management.order.detail.add_customer')}>
                  <Button icon={<PlusOutlined />} type='primary' onClick={onCreate} />
                </Tooltip>
              </div>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('management.order.detail.receiver_name')}
              required
              validateStatus={errors.address?.receiver_name ? 'error' : ''}
              help={errors.address?.receiver_name}
            >
              <Input
                value={param.address?.receiver_name}
                placeholder={t('management.order.detail.receiver_name')}
                onChange={(e) => onChangeReceiverName(e.target.value, "address")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('management.order.detail.phone')}
              required
              validateStatus={errors.address?.phone ? 'error' : ''}
              help={errors.address?.phone}
            >
              <Input
                value={param.address?.phone}
                placeholder={t('management.order.detail.phone')}
                onChange={(e) => onChangePhone(e.target.value, "address")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('management.order.detail.order_date')}
            >
              <DatePicker
                className='w-full'
                value={param.order_date ? dayjs(param.order_date) : null}
                placeholder={t('management.order.detail.order_date')}
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChange(e ? formatUTC(e.toString()) : null, "order_date")}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('management.order.detail.address')}
              required
              validateStatus={errors.address?.address ? 'error' : ''}
              help={errors.address?.address}
            >
              <Input
                value={param.address?.address_line}
                suffix={<Tooltip placement='top' title={t('management.order.detail.address_note')}><InfoCircleOutlined className='text-gray-400' /></Tooltip>}
                placeholder={t('management.order.detail.address')}
                onChange={(e) => onChangeAddress(e.target.value, "address")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('management.order.detail.note')}
            >
              <Input.TextArea
                value={param.note}
                placeholder={t('management.order.detail.note')}
                onChange={(e) => onChange(e.target.value, "note")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
          <Form.Item
              label={t('management.order.detail.list_product')}
              required
              validateStatus={errors['products'] ? 'error' : ''}
              help={errors['products']}
            >
            <Table
              rowKey="id"
              size="small"
              className='mt-1'
              pagination={false}
              columns={[
                {
                  key: 'product',
                  title: t('management.order.detail.order_product'),
                  width: 80,
                  render: (_, record, index) => (
                    <Select
                      className='w-full'
                      options={product || []}
                      value={record.name}
                      placeholder={t('management.order.detail.order_product')}
                      fieldNames={{ label: 'name', value: 'name' }}
                      showSearch
                      loading={loadProduct}
                      filterOption={false}
                      onSearch={(e) => setSearchProduct(e)}
                      disabled={readOnly || mode == MODE.VIEW}
                      onChange={(e, option) => onChangeDetailOrderProduct(e, option, index)}
                      optionRender={(option) => {
                        const item: any = option.data;
                        return (
                          <div className='flex items-center gap-2'>
                            <Image
                              src={item.image || no_image}
                              width={35}
                              height={35}
                              preview={false}
                              fallback={item.image}
                              className='rounded-md overflow-hidden'
                            />
                            <span className='line-clamp-1 w-[]'>{item.name}</span>
                          </div>
                        )
                      }}
                    />
                  ),
                },
                {
                  key: 'product',
                  title: t('management.order.detail.order_variant'),
                  width: 80,
                  render: (_, record, index) => (
                    <Select
                      className='w-full'
                      options={variant || []}
                      fieldNames={{ label: 'sku', value: 'id' }}
                      value={record.product_variant?.id}
                      placeholder={t('management.order.detail.order_variant')}
                      showSearch={false}
                      loading={loadVariant}
                      filterOption={false}
                      onSearch={(e) => setSearchProduct(e)}
                      disabled={readOnly || mode == MODE.VIEW}
                      onChange={(e, option) => onChangeDetailOrderVariant(e, option, index)}
                      optionRender={(option) => {
                        const item: any = option.data;
                        return (
                          <div className='flex items-center gap-2'>
                            <Image
                              src={item.image || no_image}
                              width={35}
                              height={35}
                              preview={false}
                              fallback={item.image}
                              className='rounded-md overflow-hidden'
                            />
                            <span className='line-clamp-1 w-[]'>{item.sku}</span>
                          </div>
                        )
                      }}
                    />
                  ),
                },
                {
                  key: 'quantity',
                  title: t('management.order.detail.quantity'),
                  width: 50,
                  render: (_, record, index) => (
                    <Input
                      value={record?.quantity}
                      onChange={(e) => onChangeDetailOrderQuantity(Number(e.target.value), record, index)}
                      type='number'
                      placeholder={t('management.order.detail.quantity')}
                    />
                  ),
                },
                {
                  key: 'total_price',
                  title: t('management.order.detail.total_price'),
                  width: 70,
                  render: (_, record) => (
                    <Input
                      value={record?.total_price}
                      type='number'
                      placeholder={t('management.order.detail.total_price')}
                    />
                  ),
                },
                {
                  key: 'action',
                  align: 'center',
                  title: (<Button icon={<PlusOutlined />} size='small' type='primary' onClick={onAddProduct} />),
                  width: 50,
                  render: (_, record) => (
                    <div className='flex justify-center'>
                      <ButtonIcon typeIcon="delete" onClick={() => onDeleteItem(record)}/>
                    </div>
                  ),
                },
              ]}
              dataSource={param.products}
            />
          </Form.Item>
          </Col>
          <Col span={24}>
            <div className='mt-4 flex flex-col items-end justify-end'>
              <div className='w-[300px] font-roboto flex justify-between'>
                <span>{'Tổng sản phẩm'}:</span>
                <span>{param.products.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className='w-[300px] font-roboto flex justify-between'>
                <span>{'Tổng sản phẩm'}:</span>
                <span className='text-md'>{fCurrencyVN(param.total_amount)}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      <CustomerDetailOrder
        ref={refCustomer}
        reload={reloadCustomer}
      />
      </>
    );
  },
);
