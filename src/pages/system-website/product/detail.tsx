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
  Switch,
  Table,
  Tooltip,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE, STATUS_PRODUCT } from '#/enum';
// import { useUserInfo } from '@/store/userStore';
import { IProduct, IProductVariant } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import Editor from '@/components/editor';
import { ArrowsAltOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadImage } from '@/components/upload/upload-image';
import { deleteImage, uploadImage } from '@/api/services/uploadService';
import { publicId } from '@/utils/publickey';
import { internalProductCategorys } from '@/api/services/productCategoryService';
import { createProduct, updateProduct } from '@/api/services/productService';
import { ColumnType } from 'antd/es/table';
import { no_image } from '@/assets/images';
import ButtonIcon from '@/components/ButtonIcon';
import VariantDetail from './variant';
import { fPercent } from '@/utils/format-number';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const ProductDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IProduct; mode: string }>({
    data: undefined,
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
        <ProductDetailForm
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

export default ProductDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: IProduct = {
  name: '',
  image: '',
  description: '',
  status: '',
  featured: false,
  body: '',
  productCategory: {
    id: '',
    title: '',
    slug: '',
  },
  variants: [],
};
type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  name: null,
  status: null,
  description: null,
  productCategory: null,
};

type PropKey = keyof IProduct;

export const ProductDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IProduct>(emptyParameter);

    const [content, setContent] = useState<string | null>(null);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const [category, setCategory] = useState<any>([]);

    const [loadImge, setLoadImage] = useState<boolean>(false);

    const [columns, setColumns] = useState<ColumnType<IProductVariant>[]>([]);
    
    const { colorPrimary, colorBorder, colorTextDescription } = useThemeToken();

    const refVariant = useRef<any>();

    useEffect(() => {
      setColumns([
        {
          key: 'image',
          dataIndex: 'image',
          title: t("website.product-variant.field.image"),
          width: 150,
          render: (_, record) => (
            <div className="flex items-center rounded-md w-max h-max overflow-hidden">
              <Image src={record.image || no_image} width={80}  className=" overflow-hidden" />
            </div>
          )
        },
        {
          key: 'size',
          title: t('website.product-variant.field.size'),
          dataIndex: 'size',
          width: 100,
          render: (_, record) => <span className="line-clamp-2">{record.size}</span>
        },
        {
          key: 'color',
          dataIndex: 'color',
          title: t('website.product-variant.field.color'),
          width: 150,
          render: (_, record) => <div className='flex items-center gap-2'><span style={{ backgroundColor: record?.color?.code, width: '20px', height: '20px', borderRadius: '50%' }}></span><span className="line-clamp-2">{record?.color?.name}</span></div>
        },
        {
          key: 'discount',
          dataIndex: 'discount',
          title: t('website.product-variant.field.discount'),
          width: 100,
          render: (_, record) => <span className="line-clamp-2">{fPercent(record.discount)}</span>
        },
        {
          key: 'quantity_in_stock',
          dataIndex: 'quantity_in_stock',
          align: 'center',
          title: t("website.product-variant.field.quantity_in_stock"),
          width: 100,
          render: (_, record) => <span className="line-clamp-2">{record.quantity_in_stock}</span>
        },
        {
          key: 'price',
          dataIndex: 'price',
          title: t('website.product-variant.field.price'),
          width: 150,
          render: (_, record) => <span className="line-clamp-2">{record.price}</span>
        },
        {
          key: 'action',
          title: t('common.action'),
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (_, record) => (
            <Space key={record.id}>
              <ButtonIcon typeIcon="edit" onClick={() => onEdit(record)} />
              <ButtonIcon typeIcon="delete" onClick={() => onDelete(record)}  />
            </Space>
          ),
        },
      ])
    }, [t]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [categoryData] = await Promise.all([
            internalProductCategorys({ limit: 1000 }),
          ]);
          setCategory(categoryData);
        } catch (error) {
          console.log(error);
        }
      }

      fetchData();
    }, []);

    // useEffect(() => {
    //   const _param = _.cloneDeep(param);
    //   if(variants && !_param?.variants?.some((item: any) => item.id === variants.id)){
    //     _param?.variants?.push(variants || null);
    //     setParam(_param);
    //   } else {
        
    //   }
    // }, [variants]);

    const update = async (data: IProduct) => {
      let _data: IProduct = _.cloneDeep(data);
      setParam(_data);
      setContent(_data.body);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IProduct) => {
      let _param: IProduct = _.cloneDeep({
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
              _errors[prop] = t('website.product.error.name');
            }
            break;
          case 'description':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.product.error.description');
            }
            break;
          case 'status':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.product.error.status');
            }
            break;
          case 'productCategory':
            _errors[prop] = null;
            if (!_setParam[prop].id) {
              _errors[prop] = t('website.product.error.category');
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
          const res = await createProduct(_payload);
          if (res) {
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateProduct(_payload.id, _payload);
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

    const onCreate = () => {
      refVariant.current.create();
    }

    const onEdit = (formValue: IProductVariant) => {
      refVariant.current.update({ ...formValue })
    };

    const onDelete = (formValue: IProductVariant) => {
      setParam((prev) =>
        prev
          ? {
              ...prev,
              variants: prev.variants?.filter(
                (item) => item.id !== formValue.id
              ) || [],
            }
          : prev
      );
    };

    const onChange = (value: string | boolean | null, field: PropKey) => {
      const _param: IProduct = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeCategory = (value: any, field: PropKey) => {
      const _param: IProduct = _.cloneDeep(param);
      (_param as any)[field].id = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onChangeStatus = (value: any, field: PropKey) => {
      const _param: IProduct = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    const onEditorChange = (value: string) => {
      if(readOnly) return;
      setContent(value);
    }

    console.log(param);

    return (
      <>
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={t('website.product.field.name')}
              required
              validateStatus={errors['name'] ? 'error' : ''}
              help={errors['name']}
            >
              <Input
                value={param.name}
                placeholder={t('website.product.field.name')}
                onChange={(e) => onChange(e.target.value, "name")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.product.field.category')}
              required
              validateStatus={errors['productCategory'] ? 'error' : ''}
              help={errors['productCategory']}
            >
              <Select
                options={category || []}
                fieldNames={{ label: 'title', value: 'id' }}
                value={param?.productCategory.id}
                placeholder={t('website.product.field.category')}
                showSearch
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChangeCategory(e, "productCategory")}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.product.field.status')}
              required
              validateStatus={errors['status'] ? 'error' : ''}
              help={errors['status']}
            >
              <Select
                value={param?.status}
                defaultValue={STATUS_PRODUCT.DEFAULT}
                options={STATUS_PRODUCT.list.map(item => ({label: t(item.label), value: item.value}))} 
                fieldNames={{ label: 'lable', value: 'value' }}
                placeholder={t('website.product.field.status')}
                showSearch
                disabled={readOnly || mode == MODE.VIEW}
                onChange={(e) => onChangeStatus(e, "status")}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('website.product.field.featured')}
            >
              <Switch 
                checked={param.featured} 
                onChange={(e) => onChange( e, "featured")}
                disabled={readOnly || mode == MODE.VIEW }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <div className='flex gap-2 cursor-pointer'>
                  <span>{t('website.product.field.description')}</span>
                  <Tooltip title={t('website.product.description-log')} placement='right'>
                    <ExclamationCircleOutlined style={{ color: colorPrimary }} />
                  </Tooltip>
                </div>
              }
              required
              validateStatus={errors['description'] ? 'error' : ''}
              help={errors['description']}
            >
              <Input.TextArea
                value={param.description}
                placeholder={t('website.product.field.description')}
                onChange={(e) => onChange(e.target.value, "description")}
                disabled={readOnly || mode == MODE.VIEW }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <div className='w-full flex gap-2 justify-between'>
                  <span>{t('website.product.field.variants')}</span>
                  <Button icon={<PlusOutlined />} size='small' type='primary' className='mb-2' onClick={onCreate}/> 
                </div>
              }
            >
              {param.variants && param.variants?.length > 0 ? (<Table
                rowKey="id"
                size="small"
                className="relative"
                // style={{ borderColor: colorBorder }}
                scroll={{ x: 'w-full' }}
                pagination={false}
                columns={columns}
                dataSource={param.variants || []}
              />) : (
                <div style={{ borderColor: colorBorder }} className='w-full flex justify-center items-center h-[50px] text-sm border border-dashed rounded-md'>
                  <span style={{ color: colorTextDescription }}>{t('website.product.variants-empty')}</span>
                </div>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('website.product.field.body')}
            >
              <Editor 
                sample={false} value={content || ""} 
                onChange={(e) => onEditorChange(e)}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label={t('website.product.field.image')}
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
          
        </Row>
      </Form>
      <VariantDetail 
        ref={refVariant} 
        data={param} 
        reload={reload} 
        setData={setParam} 
      />
      </>
    );
  },
);
