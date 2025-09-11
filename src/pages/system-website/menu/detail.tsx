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
import { MODE } from '#/enum';
import { IMenu } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { createMenu, updateMenu } from '@/api/services/menuService';
import ButtonIcon from '@/components/ButtonIcon';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const MenuDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IMenu; mode: string }>({
    data: undefined,
    mode: MODE.CREATE,
  });

  useImperativeHandle(ref, () => ({
    create: (_data: IMenu) => {
      refMode.current = {
        data: _data,
        mode: MODE.CREATE,
      };
      setIsOpen(true);
    },
    update: (_data: IMenu) => {
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
          content: { backgroundColor: colorBgContainer, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", height: room ? "100vh" : "100%" },
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
        <MenuDetailForm
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

export default MenuDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: IMenu = {
  name: '',
  item: '',
  position: '',
};

type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  name: null,
  item: null,
  position: null,
};

type PropKey = keyof IMenu;

export const MenuDetailForm = forwardRef(
  ({ readOnly, setLoading, reload, closeModal }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [mode, setMode] = useState<string>(MODE.CREATE);

    const [showJson, setShowJson] = useState<boolean>(false);

    const [param, setParam] = useState<IMenu>(emptyParameter);

    const [errors, setErrors] = useState<ErrorOption>(emptyValidate);

    const update = async (data: IMenu) => {
      let _data: IMenu = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.UPDATE);
    };

    const create = async (_init: IMenu) => {
      let _param: IMenu = _.cloneDeep({
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
              _errors[prop] = t('website.menu.error.name');
            }
            break;
          case 'item':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.menu.error.item');
            }
            break;
          case 'position':
            _errors[prop] = null;
            if (!_setParam[prop]) {
              _errors[prop] = t('website.menu.error.position');
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
          const res = await createMenu(_payload);
          if (res) {
            console.log(res);
            notification.success({ message: t("common.success"), duration: 3 });
            reload();
            closeModal();
            resetData();
          }
        } else {
          const res = await updateMenu(_payload.id, _payload);
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
      const _param: IMenu = _.cloneDeep(param);
      (_param as any)[field] = value;
      setParam(_param);
      performValidate([field as PropKey], _param);
    }

    return (
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('website.menu.field.name')}
              required
              validateStatus={errors['name'] ? 'error' : ''}
              help={errors['name']}
            >
              <Input
                value={param.name}
                placeholder={t('website.menu.field.name')}
                onChange={(e) => onChange(e.target.value, "name")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('website.menu.field.position')}
              required
              validateStatus={errors['position'] ? 'error' : ''}
              help={errors['position']}
            >
              <Input
                value={param.position}
                placeholder={t('website.menu.field.position')}
                onChange={(e) => onChange(e.target.value, "position")}
                disabled={readOnly || mode == MODE.VIEW}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <div className='flex items-center gap-2'>
                  <ButtonIcon typeIcon="view" onClick={() => setShowJson(!showJson)}/>
                  <span>{t('website.menu.field.item')}</span>
                </div>
              }
            >
              {showJson ? (
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(param.item || "{}"), null, 2);
                  } catch {
                    return param.item; // nếu không phải JSON thì hiển thị raw
                  }
                })()}
              </pre>
              ) : (
                <Input.TextArea
                  value={param.item}
                  rows={6}
                  placeholder={t('website.menu.field.item')}
                  onChange={(e) => onChange(e.target.value, "item")}
                  disabled={readOnly || mode == MODE.VIEW}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
