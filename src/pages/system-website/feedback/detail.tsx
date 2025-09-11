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
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE, TYPE_FFEDBACK } from '#/enum';
// import { useUserInfo } from '@/store/userStore';
import { IFeedback } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { UploadImage } from '@/components/upload/upload-image';
import { deleteImage, uploadImage } from '@/api/services/uploadService';
import { publicId } from '@/utils/publickey';
import { createFeeback, updateFeedback } from '@/api/services/feedbackService';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const FeedbackDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IFeedback; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: IFeedback) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: IFeedback) => {
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
        <FeedbackDetailForm
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

export default FeedbackDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: IFeedback = {
  name: '',
  avatar: '',
  email: '',
  phone: '',
  role: '',
  show: false,
  type: '',
  subject: '',
  message: '',
};
type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  name: null,
  email: null,
  phone: null,
  subject: null,
  type: null
};

type PropKey = keyof IFeedback;

export const FeedbackDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IFeedback>(emptyParameter);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const [loadImge, setLoadImage] = useState<boolean>(false);

    const update = async (data: IFeedback) => {
      let _data: IFeedback = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IFeedback) => {
      let _param: IFeedback = _.cloneDeep({
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

      // Nếu props trống thì validate tất cả
      if (props.length === 0) {
        props = Object.keys(_errors) as PropKey[];
      }

      props.forEach((prop) => {
        const value = _setParam[prop];
        _errors[prop] = null; // reset error trước

        switch (prop) {
          case 'name':
            if (!value) {
              _errors[prop] = t('website.feedback.error.name');
            }
            break;

          case 'email':
            if (!value) {
              _errors[prop] = t('website.feedback.error.email');
            } else {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                _errors[prop] = t('website.feedback.error.emailInvalid');
              }
            }
            break;

          case 'phone':
            if (!value) {
              _errors[prop] = t('website.feedback.error.phone');
            } else {
              const phoneRegex = /^[0-9]{9,15}$/; // cho phép 9-15 số
              if (!phoneRegex.test(value)) {
                _errors[prop] = t('website.feedback.error.phoneInvalid');
              }
            }
            break;

          case 'subject':
            if (!value) {
              _errors[prop] = t('website.feedback.error.subject');
            } else if (value.length < 10) {
              _errors[prop] = t('website.feedback.error.subjectTooShort');
            }
            break;

          case 'message':
            if (!value) {
              _errors[prop] = t('website.feedback.error.message');
            }
            break;

          default:
            break;
        }
      });

      setErrors(_errors);

      // check valid
      const isValid = Object.values(_errors).every((err) => !err);
      return isValid;
    };

    const submitProject = async () => {
      let _payload: any = _.cloneDeep(param);
      const isValid = await performValidate([], _payload);
      if(!isValid) return;
      setLoading(true);
      try {
        if (mode === MODE.CREATE) {
          const res = await createFeeback(_payload);
          if (res) {
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateFeedback(_payload.id, _payload);
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
      const _param: IFeedback = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeSelect = (value: any, field: PropKey) => {
      const _param: IFeedback = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('website.feedback.field.name')}
              required
              validateStatus={errors['name'] ? 'error' : ''}
              help={errors['name']}
            >
              <Input
                value={param.name}
                placeholder={t('website.feedback.field.name')}
                onChange={(e) => onChange(e.target.value, "name")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('website.feedback.field.email')}
              required
              validateStatus={errors['email'] ? 'error' : ''}
              help={errors['email']}
            >
              <Input
                value={param.email}
                placeholder={t('website.feedback.field.email')}
                onChange={(e) => onChange(e.target.value, "email")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.feedback.field.phone')}
              required
              validateStatus={errors['phone'] ? 'error' : ''}
              help={errors['phone']}
            >
              <Input
                value={param.phone}
                placeholder={t('website.feedback.field.phone')}
                onChange={(e) => onChange(e.target.value, "phone")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.feedback.field.role')}
            >
              <Input
                value={param.role}
                placeholder={t('website.feedback.field.role')}
                onChange={(e) => onChange(e.target.value, "role")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label={t('website.feedback.field.type')}
              required
              validateStatus={errors['type'] ? 'error' : ''}
              help={errors['type']}
            >
              <Select
                options={TYPE_FFEDBACK.list.map(item => ({label: t(item.label), value: item.value})) || []}
                fieldNames={{ label: 'label', value: 'value' }}
                value={param.type}
                placeholder={t('website.feedback.field.type')}
                showSearch
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChangeSelect(e, "type")}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.feedback.field.subject')}
              required
              validateStatus={errors['subject'] ? 'error' : ''}
              help={errors['subject']}
            >
              <Input
                value={param.subject}
                placeholder={t('website.feedback.field.subject')}
                onChange={(e) => onChange(e.target.value, "subject")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.feedback.field.message')}
            >
              <Input.TextArea
                value={param.message}
                placeholder={t('website.feedback.field.message')}
                onChange={(e) => onChange(e.target.value, "message")}
                disabled={readOnly || mode == MODE.VIEW }
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label={t('website.feedback.field.avatar')}
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
                      await deleteImage(id);
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
          <Col span={4}>
            <Form.Item
              label={t('website.feedback.field.show')}
            >
              <Switch 
                checked={param.show} 
                onChange={(e) => onChange( e, "show")}
                disabled={readOnly || mode == MODE.VIEW }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
