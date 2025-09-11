import { useEffect, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Button, Flex, Form, Input, InputNumber, Popconfirm, Select, Space, Table, Typography } from "antd";
import PageSizeOption from "@/components/PageSizeOptions";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import { IServiceCategory } from "#/entity";
import ButtonIcon from "@/components/ButtonIcon";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import Icons from "@/assets/icons";
import { useDebounce } from "@/router/hooks";
import { PERMISSION_ACTION, ROUTE_NAME } from "@/_mock/assets";
import { usePermission } from "@/store/userStore";
import _ from "lodash";
import { TableProps } from "antd/lib";
import { createServiceCategory, deleteServiceCategory, internalServiceCategorys, updateServiceCategory } from "@/api/services/serviceCategoryService";

type PropKey = keyof IServiceCategory;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'text' |'number';
  record: IServiceCategory;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { t } = useTranslation ();
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `${t('common.please')} ${title.toString().toLowerCase()}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ServiceCategory = () => {
  const { t } = useTranslation ();
  const { colorBorder, colorPrimary, colorTextLightSolid, colorBgContainer, colorBgElevated } = useThemeToken();
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 20,
    search: "",
    limit: 1000,
  });
  const [data, setData] = useState<IServiceCategory[]>([]);
   const [editingKey, setEditingKey] = useState('');
  const debouncedValue = useDebounce(lazyParams.search, 500);
  const permission: any = usePermission(ROUTE_NAME.Blog);
  const [form] = Form.useForm();

  const isEditing = (record: IServiceCategory) => record.id === editingKey;

  const edit = (record: Partial<IServiceCategory> & { id: React.Key }) => {
    form.setFieldsValue({ title: record.title, description: record.description });
    setEditingKey(record.id);
  };

  const cancel = () => {
    if (isCreating) {
      setData(data.filter(item => item.id !== "new"));
      setIsCreating(false);
    }
    setEditingKey('');
  };

  const fetchBlog = async () => {
    try{
      setLoading(true);
      const res = await internalServiceCategorys({limit: lazyParams.limit, search: debouncedValue});
      if(res){
        setData(res)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlog();
  }, [lazyParams.limit, debouncedValue]);

  const columsTable = [
    {
      key: 'index',
      title: '#',
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
      width: 50,
    },
    {
      key: 'title',
      title: t('website.service-category.title'),
      dataIndex: 'title',
      width: 200,
      editable: true,
      render: (_: any, record: IServiceCategory) => <span className="line-clamp-2">{record.title}</span>
    },
    {
      key: 'slug',
      dataIndex: 'slug',
      title: t('website.service-category.slug'),
      hidden: true,
      width: 150,
      render: (_: any, record: IServiceCategory) => <span className="line-clamp-2">{record.slug}</span>
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: t("website.service-category.description"),
      editable: true,
      width: 250,
      render: (_: any, record: IServiceCategory) => <span className="line-clamp-2">{record.description}</span>
    },
    {
      key: 'action',
      title: t('common.action'),
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: IServiceCategory) => {
        const editable = isEditing(record);
        
        return (
          <Space key={record.id}>
            {editable ? (
              <span>
                <Typography.Link onClick={() => save(record.id)} style={{ marginInlineEnd: 8 }}>
                  {t("common.save")}
                </Typography.Link>
                <Typography.Text onClick={cancel} className="cursor-pointer">
                  {t("common.cancel")}
                </Typography.Text>
              </span>
            ): (
              <ButtonIcon typeIcon="edit" disabled={!permission[PERMISSION_ACTION.update]} onClick={() => edit(record)} />
            )}
            {isCreating && record.id === "new" ? (
              <></>
            ): (
              <Popconfirm
                placement="bottomRight"
                title={t("common.title_delete")}
                okText={t("common.ok")}
                onConfirm={() => onDelete(record)}
                cancelText={t("common.cancel")}
              >
                <ButtonIcon typeIcon="delete" disabled={!permission[PERMISSION_ACTION.delete]} />
              </Popconfirm>
            )}
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    setColumns(columsTable);
  }, [t, editingKey]);

  const mergedColumns: TableProps<IServiceCategory>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IServiceCategory) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const reload = () => {
    fetchBlog();
  };

  const onCreate = () => {
    if (isCreating) return; 
    const newRow: IServiceCategory = {
      id: "new",
      title: "",
      description: "",
    } as IServiceCategory;

    setData(prev => [newRow, ...prev])
    
    form.setFieldsValue({
      title: "",
      description: ""
    });
    setEditingKey("new");
    setIsCreating(true);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IServiceCategory;
      if (isCreating && key === "new") {
        const {id, ...payload} = row;
        const res = await createServiceCategory(payload);
        if (res) reload();
        setIsCreating(false);
        setEditingKey('');
        return;
      }
      const index = data.findIndex((item) => key === item.id);
      if (index > -1) {
        const res = await updateServiceCategory(key as string, row);
        if(res) reload();
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  

  const onDelete = async (formValue: IServiceCategory) => {
    if(!formValue.id) return;
    try {
      const res = await deleteServiceCategory(formValue.id);
      if(res) reload();
    } catch (error) {
      console.error(error);
    } 
  }

  const changePageSize = (pageSize: number) => {
    setLazyParams({
      ...lazyParams,
      size: pageSize,
    });
  };

  const onChangeHide = (value: (PropKey | undefined)[]) =>
    setColumns(
      columns.map(item => ({
        ...item,
        hidden: value.includes(item.key as PropKey),
    }))
  );

  const onChangeSearch = (value: string) => {
    setLazyParams({
      ...lazyParams,
      search: value,
    });
  };

  const onPage = (page: number, pageSize: number) => {
    setLazyParams({
      ...lazyParams,
      page: page - 1,
      size: pageSize,
    });
  };
  
  return (
    <Region>
      <RegionCenter>
        <div style={{ backgroundColor: colorBgContainer, padding: 20 }} className="rounded-lg overflow-auto h-full">
          <Flex vertical className="h-full">
            <Flex justify="space-between" className="mb-5 p-3 rounded-md" style={{ backgroundColor: colorBgElevated }}>
              <Space>
                <Button 
                  type="primary" 
                  onClick={onCreate} 
                  icon={<PlusOutlined className="text-white"/>} 
                  disabled={!permission[PERMISSION_ACTION.create]}
                >
                  Thêm danh mục
                </Button>
              </Space>
              <Space>
                <Input placeholder={t('common.search')} suffix={<Icons.Search /> } onChange={(e) => onChangeSearch(e.target.value)} />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.hide_column')} 
                  mode="multiple"
                  maxTagCount={1}
                  options={Object.keys(t('website.service-category', { returnObjects: true })).map((key) => ({
                    value: key,
                    label: t(`website.service-category.${key}`),
                  }))}
                  onChange={(value) => onChangeHide(value)}
                />
              </Space>
            </Flex>
            <Form form={form} component={false}>
              <Table<IServiceCategory>
                rowKey="id"
                size="small"
                className="relative"
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                rowClassName="editable-row"
                style={{ borderColor: colorBorder }}
                scroll={{ x: 'w-full' }}
                loading={loading}
                pagination={{
                  responsive: true,
                  total: data.length,
                  itemRender(page, type, originalElement) {
                    if (type === "prev") {
                      return <Button size='small' className='mr-1 ml-2 !rounded-sm' style={{backgroundColor: colorPrimary, color: colorTextLightSolid, border: "none"}}  icon={<LeftOutlined style={{ fontSize: '12px' }} />}></Button>;
                    }
                    if (type === "next") {
                      return <Button size='small' className='ml-1 mr-2 !rounded-sm' style={{backgroundColor: colorPrimary, color: colorTextLightSolid, border: "none"}}  icon={<RightOutlined style={{ fontSize: '12px' }} />}></Button>;
                    }
                    if (type === "page") {
                      return <a>{page}</a>;
                    }
                    return originalElement;
                  },
                  pageSize: lazyParams.size,
                  size: 'small',
                  current: lazyParams.page + 1,
                  showTotal: (total) => (
                    <div className="absolute left-2">
                      <Space>
                        <Typography.Text className="text-sm font-normal">
                          {t('common.showing')}{' '}
                          {total > 0
                            ? `${lazyParams.page * lazyParams.size + 1} - ${Math.min(
                                (lazyParams.page + 1) * lazyParams.size,
                                total,
                              )} (${total})`
                            : '0 / 0'}
                        </Typography.Text>
                        <PageSizeOption pageSize={lazyParams.size} onChange={changePageSize} />
                      </Space>
                    </div>
                  ),
                  onChange: onPage,
                }}
                columns={mergedColumns}
                dataSource={data}
              />
            </Form>
          </Flex>
        </div>
      </RegionCenter>
    </Region>
  );
};

export default ServiceCategory;
