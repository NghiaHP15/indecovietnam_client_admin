import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Col,
  Form,
  Image,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE, SIZE_PRODUCT } from '#/enum';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined, } from '@ant-design/icons';
import { UploadImage } from '@/components/upload/upload-image';
import { deleteImage, uploadImage } from '@/api/services/uploadService';
import { publicId } from '@/utils/publickey';
import { IColor, IProduct, IProductVariant } from '#/entity';
import { createProductVariant, updateProductVariant } from '@/api/services/productVariantService';
import { internalColors } from '@/api/services/colorService';
import { internalProducts } from '@/api/services/productService';
import { useDebounce } from '@/router/hooks';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const ProductVariantDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IProductVariant; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: IProductVariant) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: IProductVariant) => {
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
        <ProductVariantDetailForm
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

export default ProductVariantDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
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
  product: {
    id: '',
    name: '',
  },
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

export const ProductVariantDetailForm = forwardRef(
  ({ setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IProductVariant>(emptyParameter);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const [loadImge, setLoadImage] = useState<boolean>(false);

    const [product, setProduct] = useState<IProduct[]>([]);

    const [color, setColor] = useState<IColor[]>([]);

    const [searchProduct, setSearchProduct] = useState<string>('');

    const [loadingProduct, setLoadingProduct] = useState<boolean>(false);

    const debouncedValue = useDebounce(searchProduct, 500);

    const update = async (data: IProductVariant) => {
      let _data: IProductVariant = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IProductVariant) => {
      let _param: IProductVariant = _.cloneDeep({
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

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoadingProduct(true);
          const [colorData, productData] = await Promise.all([
            internalColors({ limit: 1000 }),
            internalProducts({ limit: 1000, search: debouncedValue }),
          ]);
          setColor(colorData);
          setProduct(productData);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingProduct(false);
        }
      }
      fetchData();
    }, [debouncedValue]);
    
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
      setLoading(true);
      try {
        if (mode === MODE.CREATE) {
          const res = await createProductVariant(_payload);
          if (res) {
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateProductVariant(_payload.id, _payload);
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

    const onChange = (value: string | number | boolean | null, field: PropKey) => {
      const _param: IProductVariant = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeSelect = (value: any, field: PropKey) => {
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
                onChange={(_, value) => onChangeSelect(value, "color")}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.product-variant.field.name')}
              required
              validateStatus={errors['color'] ? 'error' : ''}
              help={errors['color']}
            >
              <Select
                options={product || []}
                fieldNames={{ label: 'name', value: 'id' }}
                value={param?.product?.id}
                placeholder={t('website.product-variant.field.name')}
                showSearch
                loading={loadingProduct}
                filterOption={false}
                onSearch={(e) => setSearchProduct(e)}
                onChange={(_, value) => onChangeSelect(value, "product")}
                optionRender={(option) => {
                  const item: any = option.data;
                  return (
                    <div className='flex items-center gap-2'>
                      <Image
                        src={item.image}
                        width={40}
                        height={40}
                        preview={false}
                        fallback={item.image}
                        className='rounded-sm'
                      />
                      <span>{item.name}</span>
                    </div>
                  )
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.product-variant.field.discount')}
            >
              <InputNumber
                value={param?.discount}
                prefix={'%'}
                min={0}
                style={{ width: '100%' }}
                placeholder={t('website.product-variant.field.discount')}
                onChange={(e) => onChange(e, "discount")}
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
              <InputNumber
                placeholder={t('website.product-variant.field.price')}
                min={0}
                step={1000}
                prefix={'đ'}
                style={{ width: '100%' }}
                value={param?.price}
                onChange={(e) => onChange(e, "price")}
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
              <InputNumber
                value={param?.quantity_in_stock}
                min={0}
                max={1000}
                style={{ width: '100%' }}
                placeholder={t('website.product-variant.field.quantity_in_stock')}
                onChange={(e) => onChange(e, "quantity_in_stock")}
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
