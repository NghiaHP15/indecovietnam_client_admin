import { Button, Col, Form, Input, Modal, notification, Row, Select, Space } from 'antd';
import Table from 'antd/es/table';
import Column from 'antd/es/table/Column';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IRoleGroup } from '#/entity.ts';
import { flattenTrees } from '@/utils/tree.ts';
import { PERMISSION_LIST } from '@/_mock/assets';
import { createRole, updateRole } from '@/api/services/roleService';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined } from '@ant-design/icons';

export type RoleModalProps = {
  formValue: IRoleGroup;
  title: string;
  show: boolean;
  onCancel: VoidFunction;
  isUpdate?: boolean;
  loadData?: () => void;
  // user?: any
};

export function Detail({ 
  title, 
  show, 
  formValue, 
  onCancel, 
  isUpdate, 
  loadData, 
  // user 
}: RoleModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [room, setRoom] = useState<boolean>(true);
  const { colorBgContainer } = useThemeToken();

  const [, setX] = useState<any>();

  useEffect(() => {
    const flatten = flattenTrees(formValue?.permission);
    
    // @ts-ignore
    const flattenDefault = flattenTrees(structuredClone(PERMISSION_LIST));
    
    const keys: React.Key[] = [];
    if (formValue?.permission) {
      setExpandedRowKeys(formValue.permission.map((item :any) => item.id));
    }
    if (isUpdate) {
      flatten.forEach((item: any) => {
        if (item?.permission?.length && item?.permission?.length === item.func?.length) {
          keys.push(item.id);
        }
      });
      
      setSelectedRowKeys(keys);
      flattenDefault.forEach((item: any) => {
        const isExist: any = flatten.find((x: any) => x.id === item.id);
        if (item.type === 0) {
          item.children = [];
        }
        item.permission = isExist ? isExist.permission : [];
      });
    }
    if (isUpdate) {
      const treeConfig = createTree(structuredClone(flattenDefault));
      
      form.setFieldsValue({
        ...formValue,
        config: treeConfig,
      });
      formValue.permission = treeConfig;
    } else {
      form.setFieldsValue({ ...formValue });
    }
  }, [formValue, form]);
  // tạo tree Data
  const createTree = (data: any, idKey = 'id', parentIdKey = 'parentId') => {
    const tree = {};
    const temp = {};

    data.forEach((item: any) => {
      if (item.type) {
        // @ts-ignore
        temp[item[idKey]] = { ...item };
      } else {
        // @ts-ignore
        temp[item[idKey]] = { ...item, children: [] };
      }
    });

    data.forEach((item: any) => {
      // @ts-ignore
      const parent = temp[item[parentIdKey]];
      if (parent) {
        // @ts-ignore
        parent.children.push(temp[item[idKey]]);
      } else {
        // @ts-ignore
        tree[item[idKey]] = temp[item[idKey]];
      }
    });
    // @ts-ignore
    return Object.values(tree);
  };

  const submit = async () => {
    const formValue = await form.validateFields();
    console.log("Check: ",formValue);
    
    if (formValue) {
      try {
        if (isUpdate) {
          setLoading(true);
          await updateRole(formValue.id, {...formValue,  permission: JSON.stringify(formValue.permission)});
          } else{
            delete formValue.id;
            await createRole({ ...formValue, permission: JSON.stringify(formValue.permission) });
          }
          if (onCancel) {
            onCancel();
          }
          if (loadData) {
            loadData();
          }
      } catch (error) {
        notification.error({ message: t("common.error"), duration: 3 });
      } finally {
        setLoading(false);
      }
      
    }
  };
  const onSelectChange = (record: any, selected: boolean, selectedRows: any) => {
    const _selectedKeys = selectedRows?.filter((x: any) => x)?.map((x: any) => x.id);
    const path: string[] | any = record.path?.replaceAll('[', '')?.replaceAll(']', '').split('.');
    const formData = structuredClone(formValue);
    console.log("formData", formData);
    console.log("path", path);
    
    if (!record.type) {
      if (selected) {
        if (path?.length === 1) {
          if (record.children?.length) {
            // _selectedKeys.push(record.children?.map((x: any) => x.id));
            formData.permission[path[0]].children = record.children?.map((x: any) => ({
              ...x,
              permission: x.func?.map((x: any) => x.code),
            }));
            formData.permission[path[0]].children.forEach((item: any) => {
              if (item?.children?.length > 0) {
                item.children = item.children.map((x: any) => ({
                  ...x,
                  permission: x.func?.map((x: any) => x.code),
                }));
              }
            });
          } else {
            formData.permission[path[0]]['permission'] = record.func?.map((x: any) => x.code);
          }

        }
        if (path?.length === 3) {
          // _selectedKeys.push(record.children?.map((x: any) => x.id));
          formData.permission[path[0]][path[1]][path[2]].children = record.children?.map((x: any) => ({
            ...x,
            permission: x.func?.map((x: any) => x.code),
          }));
        }
      } else {
        if (path?.length === 1) {
          // _selectedKeys.push();
          if (record.children?.length) {
            formData.permission[path[0]].children = record.children?.map((x: any) => ({
              ...x,
              permission: [],
            }));
            formData.permission[path[0]].children.forEach((item: any) => {
              if (item?.children?.length > 0) {
                item.children = item.children.map((x: any) => ({
                  ...x,
                  permission: [],
                }));
              }
            });
          } else {
            formData.permission[path[0]]['permission'] = [];
          }
        }
        if (path?.length === 3) {
          // _selectedKeys.push(record.children?.map((x: any) => x.id));
          formData.permission[path[0]][path[1]][path[2]].children = record.children?.map((x: any) => ({
            ...x,
            permission: [],
          }));

        }
      }
    } else {

      if (selected) {
        if (path.length === 1) {
          formData.permission[path[0]]['permission'] = record.func?.map((x: any) => x.code);
        }
        if (path.length === 3) {
          formData.permission[path[0]][path[1]][path[2]]['permission'] = record.func?.map((x: any) => x.code);
        }
        if (path.length === 5) {
          formData.permission[path[0]][path[1]][path[2]][path[3]][path[4]]['permission'] = record.func?.map((x: any) => x.code);
        }
      } else {
        // @ts-ignore
        if (path.length === 1) {
          formData.permission[path[0]]['permission'] = [];
        }
        if (path.length === 3) {
          formData.permission[path[0]][path[1]][path[2]]['permission'] = [];
        }
        if (path.length === 5) {
          formData.permission[path[0]][path[1]][path[2]][path[3]][path[4]]['permission'] = [];
        }
      }
    }
    setSelectedRowKeys(_selectedKeys);
    form.setFieldsValue({ permission: formData.permission });
    formValue.permission = formData.permission;
  };
  const onSelectAll = (selected: boolean, selectedRows: any, changeRows: any) => {
    setSelectedRowKeys(selectedRows?.filter((x: any) => x)?.map((x: any) => x.id));
    const formData = structuredClone(formValue);
    
    changeRows.forEach((record: any) => {
      if (record.path) {
        const path: string[] = record.path.replaceAll('[', '').replaceAll(']', '').split('.');
        formData.permission = formData.permission || {};
    
        // Hàm đảm bảo đường dẫn tồn tại
        const ensurePathExists = (obj: any, keys: string[]) => {
            return keys.reduce((acc, key, index) => {
                acc[key] = acc[key] || (index === keys.length - 1 ? {} : {});
                return acc[key];
            }, obj);
        };
    
        // Lấy object đích
        const target = ensurePathExists(formData.permission, path);
    
        // Gán giá trị permission
        target['permission'] = selected ? record.func?.map((x: any) => x.code) || [] : [];
      }
    });
    form.setFieldsValue({ permission: formData.permission });
    formValue.permission = formData.permission;
  };
  const rowSelection = {
    selectedRowKeys,
    onSelect: onSelectChange,
    onSelectAll,

  };

  
  // @ts-ignore
  return (
    <Modal
      title={title}
      width={room ? "100vw" : "1000px"}
      open={show}
      onOk={submit}
      cancelText={t('common.close')}
      maskClosable={false}
      onCancel={() => {
        form.resetFields();
        setSelectedRowKeys([]);
        Modal.destroyAll();
        onCancel();
      }}
      styles={{
        body: { overflowY: 'scroll', flexGrow: 1 },
        content: { backgroundColor: colorBgContainer, display: "flex", flexDirection: "column", justifyContent: "space-between", height: room ? "100vh" : "100%" },
        header: { backgroundColor: colorBgContainer },
        footer: { backgroundColor: colorBgContainer },
      }}
      centered
      footer={
        <div className="flex justify-center">
          <Space>
            <>
              <Button
                onClick={() => setRoom(!room)}
                icon={<ArrowsAltOutlined />}
              >
                {room ? t('common.reduce') : t('common.enlarge')}
              </Button>
              <Button
                type="primary"
                loading={loading} 
                onClick={() => {
                  submit();
                }}
              >
                {t(isUpdate ? 'common.update' : 'common.create')}
              </Button>
              <Button
                loading={loading}
                onClick={() => {
                  form.resetFields();
                  setSelectedRowKeys([]);
                  Modal.destroyAll();
                  onCancel();
                }}
              >
                {t('common.close')}
              </Button>
            </>
          </Space>
        </div>
      }
    >
      <Form
        initialValues={formValue}
        form={form}
        labelAlign="left"
        layout="vertical"
      >
        <Row gutter={20}>
          <Col span={24}>
            <Form.Item<IRoleGroup>
              label={t('setting.role.field.name')}
              name="name"
              required
              rules={[
                {
                  required: true,
                  message: t('common.error_required', { name: 'Tên' }),
                },
              ]}
            >
              <Input
                className='w-full'
                name='name'
                onBlur={(e) => {
                  let inputValue = e.target.value;
                  inputValue = e.target.value.replace(/\s+/g, ' ').trim();
                  form.setFieldValue('name', inputValue);
                }}
              />
          </Form.Item>
          </Col>
          <Col span={24}>
          <Form.Item<IRoleGroup>
            label={t('setting.role.field.description')}
            name="description"
          >
            <Input.TextArea
              className='w-full'
              onBlur={(e) => {
                let inputValue = e.target.value;
                inputValue = e.target.value.replace(/\s+/g, ' ').trim();
                form.setFieldValue('description', inputValue);
              }}
            />
          </Form.Item>
          </Col>
        </Row>
        <Form.Item<IRoleGroup> hidden name="id" />
        <Form.Item<IRoleGroup> hidden name="code" />
        <Form.Item<IRoleGroup> hidden name="permission" />
      </Form>
        <Table
          dataSource={formValue?.permission || []}
          pagination={false}
          rowKey="id"
          size="small"
          rowSelection={{ ...rowSelection, checkStrictly: false }}
          expandable={{
            expandedRowKeys, // Điều khiển trạng thái mở rộng
            onExpand: (expanded, record) => {
              setExpandedRowKeys(expanded ? [...expandedRowKeys, record.id] : expandedRowKeys.filter(key => key !== record.id));
            },
            defaultExpandAllRows: true,
          }}
        >
          <Column
            width={200}
            title={t('setting.role.menu')}
            render={(record) => {
              return <span>{t(record?.label)}</span>
            }
          }
          />
          <Column
            width={200}
            title={t('setting.role.function')}
            render={(record, _record) => {
              if (record.type || !record.children?.length) {
                
                return <Select
                  options={record?.func || []}
                  mode="multiple"
                  style={{ width: '100%' }}
                  fieldNames={{ label: 'name', value: 'code' }}
                  value={record.permission}
                  onChange={(value) => {
                    const configs = structuredClone(form.getFieldsValue().permission) || [];
                    
                    const path = record.path?.replaceAll('[', '')?.replaceAll(']', '').split('.');
                    const ensurePathExists = (obj: any, keys: string[]) => {
                      return keys.reduce((acc, key, index) => {
                          acc[key] = acc[key] || (index === keys.length - 1 ? {} : {});
                          return acc[key];
                      }, obj);
                    };
                    // Lấy object đích
                    const target = ensurePathExists(configs, path);
                
                    // Gán giá trị permission
                    target['permission'] = value || [];
                
                    // Cập nhật form và state
                    form.setFieldsValue({ permission: configs });
                    formValue.permission = configs;
                    
                    setX(configs);
                
                    // Cập nhật selectedRowKeys
                    setSelectedRowKeys(
                        value?.length === record?.func?.length 
                            ? [...selectedRowKeys, record.id] 
                            : selectedRowKeys.filter((x) => x !== record.id)
                    );
                  }}
                />;
              }
            }}
          />
        </Table>

    </Modal>
  );
}
