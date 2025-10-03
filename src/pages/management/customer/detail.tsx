import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { GENDER_OPTIONS, LEVEL_CUSTOMER, MODE, PROVIDER_CUSTOMER } from '#/enum';
import { ICustomer } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { publicId } from '@/utils/publickey';
import { createCustomer, updateCustomer } from '@/api/services/customerService';
import dayjs from 'dayjs';
import { UploadImage } from '@/components/upload';
import { deleteImage, uploadImage } from '@/api/services/uploadService';
import { formatUTC } from '@/utils/format-date';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const CustomerDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: ICustomer; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: ICustomer) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: ICustomer) => {
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
        <CustomerDetailForm
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

export default CustomerDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: ICustomer = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  date_of_birth: dayjs().format('YYYY-MM-DD'),
  gender: GENDER_OPTIONS.OTHER,
  level: LEVEL_CUSTOMER.SLIVER,
  avatar: '',
  provider: PROVIDER_CUSTOMER.LOCAL,
  password: '123456',
};
type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  firstname: null,
  lastname: null,
  email: null,
  phone: null,
};

type PropKey = keyof ICustomer;

export const CustomerDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<ICustomer>(emptyParameter);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const [loadImge, setLoadImage] = useState<boolean>(false);
  
    const update = async (data: ICustomer) => {
      let _data: ICustomer = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: ICustomer) => {
      let _param: ICustomer = _.cloneDeep({
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
          case 'firstname':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('management.customer.error.firstname');
            }
            break;
          case 'lastname':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('management.customer.error.lastname');
            }
            break;
          case 'email':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('management.customer.error.email');
            }
            break;
          case 'phone':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('management.customer.error.phone');
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
          const res = await createCustomer(_payload);
          if (res) {
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateCustomer(_payload.id, _payload);
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
      const _param: ICustomer = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeSelect = (value: any, field: PropKey) => {
      const _param: ICustomer = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('management.customer.field.firstname')}
              required
              validateStatus={errors['firstname'] ? 'error' : ''}
              help={errors['firstname']}
            >
              <Input
                value={param.firstname}
                placeholder={t('management.customer.field.firstname')}
                onChange={(e) => onChange(e.target.value, "firstname")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('management.customer.field.lastname')}
              required
              validateStatus={errors['lastname'] ? 'error' : ''}
              help={errors['lastname']}
            >
              <Input
                value={param.lastname}
                placeholder={t('management.customer.field.lastname')}
                onChange={(e) => onChange(e.target.value, "lastname")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('management.customer.field.email')}
              required
              validateStatus={errors['email'] ? 'error' : ''}
              help={errors['email']}
            >
              <Input
                value={param.email}
                placeholder={t('management.customer.field.email')}
                onChange={(e) => onChange(e.target.value, "email")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('management.customer.field.password')}
            >
              <Input
                value={param.password}
                type='password'
                placeholder={t('management.customer.field.password')}
                onChange={(e) => onChange(e.target.value, "password")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('management.customer.field.phone')}
              required
              validateStatus={errors['phone'] ? 'error' : ''}
              help={errors['phone']}
            >
              <Input
                value={param.phone}
                placeholder={t('management.customer.field.phone')}
                onChange={(e) => onChange(e.target.value, "phone")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('management.customer.field.gender')}
            >
              <Select
                options={GENDER_OPTIONS.list.map(item => ({label: t(item.label), value: item.value})) || []}
                fieldNames={{ label: 'label', value: 'value' }}
                value={param.gender}
                placeholder={t('management.customer.field.gender')}
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChangeSelect(e, "gender")}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('management.customer.field.date_of_birth')}
            >
              <DatePicker
                className='w-full'
                value={param.date_of_birth ? dayjs(param.date_of_birth) : null}
                placeholder={t('management.customer.field.date_of_birth')}
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChange(e ? formatUTC(e.toString()) : null, "date_of_birth")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('management.customer.field.level')}
            >
              <Select
                options={LEVEL_CUSTOMER.list.map(item => ({label: t(item.label), value: item.value})) || []}
                fieldNames={{ label: 'label', value: 'value' }}
                value={param.level}
                placeholder={t('management.customer.field.level')}
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChangeSelect(e, "level")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('management.customer.field.provider')}
            >
              <Select
                options={PROVIDER_CUSTOMER.list.map(item => ({label: t(item.label), value: item.value})) || []}
                fieldNames={{ label: 'label', value: 'value' }}
                value={param.provider}
                placeholder={t('management.customer.field.provider')}
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChangeSelect(e, "provider")}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label={t('management.customer.field.avatar')}
            >
              <UploadImage
                loading={loadImge}
                defaultImage={param.avatar || ""}
                customRequest={async ({ file, onSuccess, onError}) => {
                  try{
                    setLoadImage(true);
                    const formData = new FormData();
                    formData.append('image', file as Blob);
                    if(param.avatar) {
                      const id = publicId(param.avatar);
                      id && await deleteImage(id);
                    }
                    const res = await uploadImage(formData);
                    if(res){
                      onChange(res.url, "avatar");
                      onSuccess?.(res, file as any);
                    }
                  } catch (error) {
                   onError?.(error as any); 
                  } finally {
                    setLoadImage(false);
                  }
                }} 
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
