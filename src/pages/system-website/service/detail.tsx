import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
  Tooltip,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE } from '#/enum';
import { IService } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import Editor from '@/components/editor';
import dayjs from 'dayjs';
import { ArrowsAltOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { UploadImage } from '@/components/upload/upload-image';
import { deleteImage, uploadImage } from '@/api/services/uploadService';
import { publicId } from '@/utils/publickey';
import { internalServiceCategorys } from '@/api/services/serviceCategoryService';
import { createService, updateService } from '@/api/services/serviceService';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const ServiceDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IService; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: IService) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: IService) => {
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
        <ServiceDetailForm
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

export default ServiceDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: IService = {
  title: '',
  image: '',
  description: '',
  category: {
    id: '',
    title: '',
    slug: ''
  },
  published_at: new Date(),
  tag: [],
  body: null,
};
type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  title: null,
  description: null,
  author: null,
  category: null,
};

type PropKey = keyof IService;

export const ServiceDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IService>(emptyParameter);

    const [content, setContent] = useState<string | null>(null);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const [category, setCategory] = useState<any>([]);

    const [loadImge, setLoadImage] = useState<boolean>(false);
    
    const { colorPrimary } = useThemeToken();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [categoryData] = await Promise.all([
            internalServiceCategorys({ limit: 1000 }),
          ])
          setCategory(categoryData);
        } catch (error) {
          console.log(error);
        }
      }

      fetchData();
    }, []);

    const update = async (data: IService) => {
      let _data: IService = _.cloneDeep(data);
      setParam(_data);
      setContent(_data.body);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IService) => {
      let _param: IService = _.cloneDeep({
        ...emptyParameter,
      });
      setParam(_param);
      setContent(_param.body);
      setMode(MODE.CREATE);
    };

    useImperativeHandle(ref, () => ({
      create: create,

      update: update,

      submit: submitProject,

      reset: resetData,
    }));

    console.log(param);
    

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
          case 'title':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.blog.error.title');
            }
            break;
          case 'description':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.blog.error.description');
            }
            break;
          case 'category':
            _errors[prop] = null;
            if (!_setParam[prop].id) {
              _errors[prop] = t('website.blog.error.author');
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
      _payload.body = content;
      const isValid = await performValidate([], _payload);
      if(!isValid) return;
      setLoading(true);
      try {
        if (mode === MODE.CREATE) {
          const res = await createService(_payload);
          if (res) {
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateService(_payload.id, _payload);
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
      const _param: IService = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeSelect = (value: any, field: PropKey) => {
      const _param: IService = _.cloneDeep(param);
      (_param as any)[field].id = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onTagChange = (value: string[]) => {
      const _param: IService = _.cloneDeep(param);
      _param.tag = value;
      setParam(_param);
    }

    const onEditorChange = (value: string) => {
      if(readOnly) return;
      setContent(value);
    }

    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={t('website.service.field.title')}
              required
              validateStatus={errors['title'] ? 'error' : ''}
              help={errors['title']}
            >
              <Input
                value={param.title}
                placeholder={t('website.service.field.title')}
                onChange={(e) => onChange(e.target.value, "title")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('website.service.field.category')}
              required
              validateStatus={errors['category'] ? 'error' : ''}
              help={errors['category']}
            >
              <Select
                options={category || []}
                fieldNames={{ label: 'title', value: 'id' }}
                value={param?.category.id}
                placeholder={t('website.service.field.category')}
                showSearch
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChangeSelect(e, "category")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('website.service.field.published_at')}>
              <DatePicker
                value={param?.published_at ? dayjs(param?.published_at) : null}
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChange(e ? e.toISOString() : null, "published_at")}
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.service.field.description')}
              required
              validateStatus={errors['description'] ? 'error' : ''}
              help={errors['description']}
            >
              <Input.TextArea
                value={param.description}
                placeholder={t('website.service.field.description')}
                onChange={(e) => onChange(e.target.value, "description")}
                disabled={readOnly || mode == MODE.VIEW }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <div className='flex gap-2 cursor-pointer'>
                  <span>{t('website.service.field.tag')}</span>
                  <Tooltip title={t('website.blog.tag-log')} placement='right'>
                    <ExclamationCircleOutlined style={{ color: colorPrimary }} />
                  </Tooltip>
                </div>
              }
            >
              <Input
                value={param.tag}
                placeholder={t('website.service.field.tag')}
                onChange={(e) => onTagChange(e.target.value.split(","))}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.service.field.body')}
            >
              <Editor 
                sample={false} value={content || ""} 
                onChange={(e) => onEditorChange(e)}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label={t('website.service.field.image')}
            >
              <UploadImage
                loading={loadImge}
                defaultImage={param.image || ""}
                customRequest={async ({ file, onSuccess, onError}) => {
                  try{
                    setLoadImage(true);
                    const formData = new FormData();
                    formData.append('image', file as Blob);
                    if(param.image) {
                      const id = publicId(param.image);
                      id && await deleteImage(id);
                    }
                    const res = await uploadImage(formData);
                    if(res){
                      onChange(res.url, "image");
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
