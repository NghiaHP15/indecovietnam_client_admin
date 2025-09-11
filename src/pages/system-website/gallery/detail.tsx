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
import { MODE, TYPE_GALLERY } from '#/enum';
import { IGallery } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { UploadImage } from '@/components/upload/upload-image';
import { deleteImage, uploadImage } from '@/api/services/uploadService';
import { publicId } from '@/utils/publickey';
import { createGallery, updateGallery } from '@/api/services/galleryService';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const GalleryDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IGallery; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: IGallery) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: IGallery) => {
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
        <GalleryDetailForm
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

export default GalleryDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: IGallery = {
  title: '',
  image: '',
  href: '',
  type: '',
  description: '',
};

type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  title: null,
  image: null,
  type: null,
};

type PropKey = keyof IGallery;

export const GalleryDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IGallery>(emptyParameter);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const [loadImge, setLoadImage] = useState<boolean>(false);

    const update = async (data: IGallery) => {
      let _data: IGallery = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IGallery) => {
      let _param: IGallery = _.cloneDeep({
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
          case 'title':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.gallery.error.title');
            }
            break;
          case 'type':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.gallery.error.type');
            }
            break;
          case 'image':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.gallery.error.image');
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
          const res = await createGallery(_payload);
          if (res) {
            console.log(res);
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateGallery(_payload.id, _payload);
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
      const _param: IGallery = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={t('website.gallery.field.title')}
              required
              validateStatus={errors['title'] ? 'error' : ''}
              help={errors['title']}
            >
              <Input
                value={param.title}
                placeholder={t('website.gallery.field.title')}
                onChange={(e) => onChange(e.target.value, "title")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('website.gallery.field.href')}
            >
              <Input
                value={param.href}
                placeholder={t('website.gallery.field.href')}
                onChange={(e) => onChange(e.target.value, "href")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('website.gallery.field.type')}
              required
              validateStatus={errors['type'] ? 'error' : ''}
              help={errors['type']}
            >
              <Select
                value={param.type}
                options={TYPE_GALLERY.list.map(item => ({label: t(item.label), value: item.value}))}
                placeholder={t('website.gallery.field.type')}
                fieldNames={{ label: 'label', value: 'value' }}
                onChange={(e) => onChange(e, "type")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.gallery.field.description')}
            >
              <Input
                value={param.description}
                placeholder={t('website.gallery.field.description')}
                onChange={(e) => onChange(e.target.value, "description")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.gallery.field.image')}
              validateStatus={errors['image'] ? 'error' : ''}
              help={errors['image']}
            >
              <UploadImage
                width='100%'
                loading={loadImge}
                defaultImage={param.image || ""}
                customRequest={async ({ file, onSuccess, onError}) => {
                  try{
                    setLoadImage(true);
                    const formData = new FormData();
                    formData.append('image', file as Blob);
                    if(param.image) {
                      const id = publicId(param.image);
                      await deleteImage(id);
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
