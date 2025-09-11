import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE } from '#/enum';
import { IAddress } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { internalCustomers } from '@/api/services/customerService';
import { createAddress, updateAddress } from '@/api/services/addressService';
import { no_avatar } from '@/assets/images';
import { useDebounce } from '@/router/hooks';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const AddressDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IAddress; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: IAddress) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: IAddress) => {
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
        <AddressDetailForm
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

export default AddressDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: IAddress = {
  receiver_name: '',
  phone: '',
  address_line: '',
  ward: '',
  district: '',
  city: '',
  default: false,
  customer: {
    id: '',
    firstname: '',
    lastname: '',
  }
};
type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  receiver_name: null,
  phone: null,
  customer: null,
};

type PropKey = keyof IAddress;

export const AddressDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IAddress>(emptyParameter);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const [customer, setCustomer] = useState<any>([]);

    const [loadCustomer, setLoadCustomer] = useState<boolean>(false);

    const [searchProduct, setSearchProduct] = useState<string>('');

    const debouncedValue = useDebounce(searchProduct, 500);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoadCustomer(true);
          const [customerData] = await Promise.all([
            internalCustomers({ limit: 1000, search: debouncedValue }),
          ])
          setCustomer(customerData);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadCustomer(false);
        }
      }
    
      fetchData();
    }, [debouncedValue]);
    
  
    const update = async (data: IAddress) => {
      let _data: IAddress = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IAddress) => {
      let _param: IAddress = _.cloneDeep({
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
          case 'receiver_name':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.address.error.receiver_name');
            }
            break;
          case 'phone':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.address.error.phone');
            }
            break;
          case 'customer':
            _errors[prop] = null;
            if (!_setParam[prop].id) {
              _errors[prop] = t('website.address.error.customer');
            }
            break;
          default:
            break;
        }
      });
    
      setErrors(_errors);
    
      let isValid = true;
      for (const key in _errors) {
        if (_errors[key]) {
          isValid = false;
        }
      }
      return isValid;
    };

    const submitProject = async () => {
      let _payload: any = _.cloneDeep(param);
      const isValid = await performValidate([], _payload);
      if(!isValid) return;
      setLoading(true);
      try {
        if (mode === MODE.CREATE) {
          const res = await createAddress(_payload);
          if (res) {
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateAddress(_payload.id, _payload);
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

    const onChange = (value: string | boolean | null, field: PropKey) => {
      const _param: IAddress = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeSelect = (value: any, field: PropKey) => {
      const _param: IAddress = _.cloneDeep(param);
      (_param as any)[field].id = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t('website.address.field.receiver_name')}
              required
              validateStatus={errors['receiver_name'] ? 'error' : ''}
              help={errors['receiver_name']}
            >
              <Input
                value={param.receiver_name}
                placeholder={t('website.address.field.receiver_name')}
                onChange={(e) => onChange(e.target.value, "receiver_name")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.address.field.phone')}
              required
              validateStatus={errors['phone'] ? 'error' : ''}
              help={errors['phone']}
            >
              <Input
                value={param.phone}
                placeholder={t('website.address.field.phone')}
                onChange={(e) => onChange(e.target.value, "phone")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.address.field.customer')}
              required
              validateStatus={errors['customer'] ? 'error' : ''}
              help={errors['customer']}
            >
              <Select
                options={customer || []}
                fieldNames={{ label: 'lastname', value: 'id' }}
                value={param?.customer?.id}
                placeholder={t('website.address.field.customer')}
                showSearch
                filterOption={false}
                loading={loadCustomer}
                onSearch={(e) => setSearchProduct(e)}
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChangeSelect(e, "customer")}
                optionRender={(option) => {
                  const item: any = option.data;
                  return (
                    <div className='flex items-center gap-2'>
                      <Image
                        src={item.avatar || no_avatar}
                        width={30}
                        height={30}
                        preview={false}
                        fallback={item.image}
                        className='rounded-full'
                      />
                      <span>{item.lastname + " " + item.firstname}</span>
                    </div>
                  )
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.address.field.ward')}
            >
              <Input
                value={param.ward}
                placeholder={t('website.address.field.ward')}
                onChange={(e) => onChange(e.target.value, "ward")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.address.field.district')}
            >
              <Input
                value={param.district}
                placeholder={t('website.address.field.district')}
                onChange={(e) => onChange(e.target.value, "district")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label={t('website.address.field.city')}
            >
              <Input
                value={param.city}
                placeholder={t('website.address.field.city')}
                onChange={(e) => onChange(e.target.value, "city")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.address.field.address_line')}
            >
              <Input
                value={param.address_line}
                placeholder={t('website.address.field.address_line')}
                onChange={(e) => onChange(e.target.value, "address_line")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
