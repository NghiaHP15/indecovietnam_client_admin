import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE, SIZE_PRODUCT } from '#/enum';
import { IColor, IProduct, IProductVariant } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { UploadImage } from '@/components/upload/upload-image';
import { deleteImage, uploadImage } from '@/api/services/uploadService';
import { publicId } from '@/utils/publickey';
import { internalColors } from '@/api/services/colorService';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  reload: () => void;
  data: IProduct;
  setData: (data: IProduct) => void;
};

const VariantDetail = forwardRef(({ reload, data, setData }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IProduct | null; mode: string }>({
    data: data,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: IProduct) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: IProduct) => {
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
        <VariantDetailForm
          ref={refDetail}
          setLoading={setLoading}
          reload={reload}
          closeModal={closeModal}
          data={data}
          setData={setData}
        />
      </Modal>
    </>
  );
});

export default VariantDetail;

type FormProps = {
  reload: () => void;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  data: IProduct;
  setData: (data: IProduct) => void;
};

const emptyParameter: IProductVariant = {
  image: '',
  color: {
    id: '',
    name: '',
    code: '',
  },
  size: '',
  price: 0,
  discount: 0,
  is_active: false,
};
type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  color: null,
  size: null,
  price: null,
  quantity_in_stock: null,
};

type PropKey = keyof IProductVariant;

export const VariantDetailForm = forwardRef(
  ({ setData, closeModal, data }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IProductVariant>(emptyParameter);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const [loadImge, setLoadImage] = useState<boolean>(false);

    const [color, setColor] = useState<IColor[]>([]);

    const update = async (data: IProductVariant) => {
      let _data: IProductVariant = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IProductVariant) => {
      let _param: IProductVariant = _.cloneDeep({
        ...emptyParameter,
      });
      _param.id = uuidv4();
      setParam(_param);
      setMode(MODE.CREATE);
    };

    useImperativeHandle(ref, () => ({
      create: create,

      update: update,

      submit: submitProject,

      reset: resetData,
    }));

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [colorData] = await Promise.all([
            internalColors({ limit: 1000 }),
          ]);
          setColor(colorData);
        } catch (error) {
          console.log(error);
        }
      }
    
      fetchData();
    }, []);
    
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
          case 'color':
            _errors[prop] = null;
            if (!_setParam[prop].id) {
              _errors[prop] = t('website.product-variant.error.color');
            }
            break;
          case 'size':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.product-variant.error.size');
            }
            break;
          case 'quantity_in_stock':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.product-variant.error.quantity_in_stock');
            }
            break;
          case 'price':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.product-variant.error.price');
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
      if (mode === MODE.CREATE) {
        const _newData = _.cloneDeep(data);
        _newData.variants && _newData.variants.push(_payload);
        setData(_newData);
        closeModal();
      }
      else {
        const _newData = _.cloneDeep(data);
        const _newvariant: any = _newData.variants && _newData.variants.map((item: any) => item.id === _payload.id ? {..._payload} : {...item});
        _newData.variants = _newvariant;
        setData(_newData);
        closeModal();
      }
    };

    const resetData = () => {
      setParam(emptyParameter);
    };

    const onChange = (value: string | boolean | null, field: PropKey) => {
      const _param: IProductVariant = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeColor = (value: any, field: PropKey) => {
      const _param: IProductVariant = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('website.product-variant.field.size')}
              required
              validateStatus={errors['size'] ? 'error' : ''}
              help={errors['size']}
            >
              <Select
                options={SIZE_PRODUCT.list.map(item => ({label: t(item.label), value: item.value}))}
                fieldNames={{ label: 'label', value: 'value' }}
                value={param?.size}
                placeholder={t('website.product-variant.field.size')}
                showSearch
                onChange={(e) => onChange(e, "size")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('website.product-variant.field.color')}
              required
              validateStatus={errors['color'] ? 'error' : ''}
              help={errors['color']}
            >
              <Select
                options={color || []}
                fieldNames={{ label: 'name', value: 'id' }}
                value={param?.color?.id}
                placeholder={t('website.product-variant.field.color')}
                showSearch
                onChange={(_, value) => onChangeColor(value, "color")}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.product-variant.field.discount')}
            >
              <Input
                value={param?.discount}
                prefix={'%'}
                placeholder={t('website.product-variant.field.discount')}
                type="number"
                onChange={(e) => onChange(e.target.value, "discount")}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.product-variant.field.price')}
              validateStatus={errors['price'] ? 'error' : ''}
              required
              help={errors['price']}
            >
              <Input
                placeholder={t('website.product-variant.field.price')}
                prefix={'đ'}
                type="number"
                value={param?.price}
                onChange={(e) => onChange(e.target.value, "price")}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.product-variant.field.quantity_in_stock')}
              validateStatus={errors['quantity_in_stock'] ? 'error' : ''}
              required
              help={errors['quantity_in_stock']}
            >
              <Input
                value={param?.quantity_in_stock}
                placeholder={t('website.product-variant.field.quantity_in_stock')}
                type="number"
                onChange={(e) => onChange(e.target.value, "quantity_in_stock")}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label={t('website.product-variant.field.image')}
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
          <Col span={19}>
            <Form.Item
              label={t('website.product-variant.field.is_active')}
            >
              <Switch 
                checked={param.is_active} 
                onChange={(e) => onChange( e, "is_active")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
