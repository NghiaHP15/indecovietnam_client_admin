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
  Select,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { User } from '#/entity';
import { MODE } from '#/enum';
import userService from '@/api/services/userService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUserInfo } from '@/store/userStore';
import roleService from '@/api/services/roleService';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const UserDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const refMode = useRef<{ data?: User; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: User) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: User) => {
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
        <UserDetailForm
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

export default UserDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: User = {
  id: '',
  userName: '',
  fullName: '',
  address: '',
  refId: '',
  refRole: '',
  vendorId: '',
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

type PropKey = keyof User;

export const UserDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();

    const { vendorId } = useUserInfo();
    
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<User>(emptyParameter)

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);
  
    const query = {
      role: useQuery({
        queryKey: ['Role'],
        queryFn: () => roleService.internalRoles(),
      })
    } 
      
    const mutation = {
      createUser: useMutation({
        mutationFn: userService.createUser,
        onSuccess: () => {
          notification.success({ message: t("common.success"), duration: 3 });
          reload();
          closeModal();
        }
      }),
      updateUser: useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => userService.updateUser(id, data),
        onSuccess: () => {
          notification.success({ message: t("common.success"), duration: 3 });
          reload();
          closeModal();
        }
      }),
    }

    const update = async (data: User) => {
      let _data = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: User) => {
      let _param: User = _.cloneDeep({
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
          case 'userName':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('system.user.error.username');
            }
            break;
          case 'fullName':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('system.user.error.fullname');
            }
            break;
          case 'refRole':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('system.user.error.role');
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
          await mutation.createUser.mutateAsync(_payload);
        } else {
          await mutation.updateUser.mutateAsync({ id: param.id as string, data: _payload });
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
          <Col span={12}>
            <Form.Item
              label={t('system.user.username')}
              required
              validateStatus={errors['userName'] ? 'error' : ''}
              help={errors['username']}
            >
              <Input
                value={param.userName}
                onChange={(e) => onChange(e.target.value, "userName")}
                disabled={readOnly || mode == MODE.VIEW ||mode === MODE.UPDATE}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('system.user.fullname')}
              required
              validateStatus={errors['fullname'] ? 'error' : ''}
              help={errors['fullname']}
            >
              <Input
                value={param.fullName}
                onChange={(e) => onChange(e.target.value, "fullName")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('system.user.address')}>
              <Input
                  value={param.address}
                  onChange={(e) => onChange(e.target.value, "address")}
                  disabled={readOnly || mode == MODE.VIEW}
                />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label={t('system.user.role')}
              required
              validateStatus={errors['refRole'] ? 'error' : ''}
              help={errors['refRole']}
            >
              <Select
                options={query.role?.data || []}
                fieldNames={{ label: 'name', value: 'code' }}
                value={param?.refRole}
                showSearch
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChange(e, "refRole")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
