import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { Service } from '#/entity';
import { MODE } from '#/enum';
import { useMutation } from '@tanstack/react-query';
import { useUserInfo } from '@/store/userStore';
import serviceService from '@/api/services/serviceService';

type Props = {
  reload: () => void;
  readOnly?: boolean;
};

const ServiceDetail = forwardRef(({ reload, readOnly }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const refMode = useRef<{ data?: Service; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: Service) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: Service) => {
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
          body: { overflowY: 'scroll', maxHeight: 'calc(100vh - 200px)' },
        }}
        width={800}
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
        <ServiceDetailForm
          ref={refDetail}
          setLoading={setLoading}
          reload={reload}
          closeModal={closeModal}
          readOnly={readOnly}
        />
      </Modal>
    </>
  );
});

export default ServiceDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
};

const emptyParameter: Service = {
  id: '',
  name: '',
  description: '',
  publicKey: '',
  privateKey: '',
};
type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  username: null,
  fullname: null,
  refId: null,
  refRole: null,
};

type PropKey = keyof Service;

export const ServiceDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();

    const { vendorId } = useUserInfo();
    
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<Service>(emptyParameter)

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);
      
    const mutation = {
      createService: useMutation({
        mutationFn: serviceService.createService,
        onSuccess: () => {
          notification.success({ message: t("common.success"), duration: 3 });
          reload();
          closeModal();
        }
      }),
      updateService: useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => serviceService.updateService(id, data),
        onSuccess: () => {
          notification.success({ message: t("common.success"), duration: 3 });
          reload();
          closeModal();
        }
      }),
    }

    const update = async (data: Service) => {
      let _data = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: Service) => {
      let _param: Service = _.cloneDeep({
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
          case 'name':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('system.user.error.username');
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
      const isValid = await performValidate([], _payload)
      _payload.vendorId = vendorId;
      if(!isValid) return;
      setLoading(true);
      try {
        if (mode === MODE.CREATE) {
          await mutation.createService.mutateAsync(_payload);
        } else {
          await mutation.updateService.mutateAsync({ id: param.id as string, data: _payload });
        }
      } catch (error) {
        notification.error({ message: t("common.error"), duration: 3 });
            } finally {
        setLoading(false);
      }
    };

    const resetData = () => {
      setParam(emptyParameter);
    };

    const onChange = (value: string, field: PropKey) => {
      const _param = _.cloneDeep(param);
      _param[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={t('category.service.name')}
              required
              validateStatus={errors['name'] ? 'error' : ''}
              help={errors['name']}
            >
              <Input
                value={param.name}
                onChange={(e) => onChange(e.target.value, "name")}
                disabled={readOnly || mode == MODE.VIEW ||mode === MODE.UPDATE}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('category.service.description')}
            >
              <Input.TextArea
                value={param.description}
                rows={1}
                onChange={(e) => onChange(e.target.value, "description")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t('category.service.public_key')}>
              <Input.TextArea
                  value={param.publicKey}
                  rows={3}
                  onChange={(e) => onChange(e.target.value, "publicKey")}
                  disabled={readOnly || mode == MODE.VIEW}
                />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item 
              label={t('category.service.private_key')}
            >
              <Input.TextArea
                  value={param.privateKey}
                  rows={3}
                  onChange={(e) => onChange(e.target.value, "privateKey")}
                  disabled={readOnly || mode == MODE.VIEW}
                />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
