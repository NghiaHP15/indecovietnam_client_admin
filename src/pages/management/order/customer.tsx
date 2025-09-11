import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE } from '#/enum';
import { ICustomer } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import _ from 'lodash';
import { createCustomer } from '@/api/services/customerService';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const CustomerDetailOrder = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

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
  }));

  const afterOpenChange = (_open: boolean) => {
    if (_open) {
      if (refMode.current?.mode == MODE.CREATE) {
        refDetail.current.create(refMode.current?.data);
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
          content: { backgroundColor: colorBgContainer, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" },
          header: { backgroundColor: colorBgContainer },
          footer: { backgroundColor: colorBgContainer },
        }}
        width={"600px"}
        centered
        footer={[
          <Space className="pr-3">
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
        <CustomerForm
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

export default CustomerDetailOrder;

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
  date_of_birth: null,
  gender: 'other',
  level: 'silver',
  avatar: '',
  provider: 'local',
  password: '123456',
};
type ErrorOption = {
  [key: string]: string | null;
}

const emptyValidate: ErrorOption = {
  firstname: null,
  lastname: null,
  email: null,
  phone: null,
};

type PropKey = keyof ICustomer;

export const CustomerForm = forwardRef(
  ({ setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<ICustomer>(emptyParameter);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const create = async (_init: ICustomer) => {
      let _param: ICustomer = _.cloneDeep({
        ...emptyParameter,
      });
      setParam(_param);
      setMode(MODE.CREATE);
    };

    useImperativeHandle(ref, () => ({
      create: create,

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
              _errors[prop] = t('management.customer.error.customer');
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
              />
            </Form.Item>
          </Col>
          <Col span={12}>
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
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
