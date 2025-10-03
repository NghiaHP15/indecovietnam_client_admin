import { useEffect, useRef, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Button, Checkbox, Flex, Image, Input, Popconfirm, Select, Space, Table, Typography } from "antd";
import PageSizeOption from "@/components/PageSizeOptions";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import { IFeedback } from "#/entity";
import { ColumnType } from "antd/es/table";
import ButtonIcon from "@/components/ButtonIcon";
import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { no_image } from "@/assets/images";
import { useDebounce } from "@/router/hooks";
import FeedbackDetail from "./detail";
import { PERMISSION_ACTION, ROUTE_NAME } from "@/_mock/assets";
import { usePermission } from "@/store/userStore";
import _ from "lodash";
import { deleteFeedback, internalFeedback, updateFeedback } from "@/api/services/feedbackService";
import { TYPE_FFEDBACK } from "#/enum";
import { updateEmployee } from "@/api/services/employeeService";

type PropKey = keyof IFeedback;

const Feedback = () => {
  const { t } = useTranslation ();
  const { colorBorder, colorPrimary, colorTextLightSolid, colorBgContainer, colorBgElevated } = useThemeToken();
  const [columns, setColumns] = useState<ColumnType<IFeedback>[]>([]);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 20,
    type: "",
    search: "",
    limit: 1000,
  });
  const [data, setData] = useState<IFeedback[]>([]);
  const debouncedValue = useDebounce(lazyParams.search, 500);
  const refDetail = useRef<any>();
  const permission: any = usePermission(ROUTE_NAME.Blog);

  const fetchBlog = async () => {
    try{
      setLoading(true);
      const res = await internalFeedback({limit: lazyParams.limit, search: debouncedValue, type: lazyParams.type});
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
  }, [lazyParams.limit, debouncedValue, lazyParams.type]);

  useEffect(() => {
    setColumns([
      {
        key: 'index',
        title: '#',
        render: (_, __, index) => <span>{index + 1}</span>,
        width: 50,
      },
      {
        key: 'name',
        title: t('website.feedback.field.name'),
        dataIndex: 'title',
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.name}</span>
      },
      {
        key: 'avatar',
        dataIndex: 'avatar',
        title: t("website.feedback.field.avatar"),
        width: 150,
        render: (_, record) => (
          <div className="flex items-center rounded-full w-max h-max overflow-hidden">
            <Image src={record.avatar || no_image} width={60} className=" overflow-hidden rounded-full" />
          </div>
        )
      },
      {
        key: 'email',
        dataIndex: 'email',
        title: t('website.feedback.field.email'),
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.email}</span>
      },
      {
        key: 'phone',
        dataIndex: 'phone',
        title: t("website.feedback.field.phone"),
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.phone}</span>
      },
      {
        key: 'role',
        dataIndex: 'role',
        title: t("website.feedback.field.role"),
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.role}</span>
      },
      {
        key: 'show',
        dataIndex: 'show',
        align: 'center',
        title: t("website.feedback.field.show"),
        width: 100,
        render: (_, record) => <Checkbox checked={record.show} onChange={(e) => onCheck(e.target.checked, record)} />
      },
      {
        key: 'type',
        dataIndex: 'type',
        title: t('website.feedback.field.type'),
        width: 150,
        render: (_, record) =>(
        <Select 
          value={record.type} 
          options={TYPE_FFEDBACK.list.map(item => ({label: t(item.label), value: item.value}))} 
          fieldNames={{ label: 'label', value: 'value' }}
          onChange={(value) => onSelect(value, record)}
          />
        )
      },
      {
        key: 'subject',
        dataIndex: 'subject',
        title: t("website.feedback.field.subject"),
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.subject}</span>
      },
      {
        key: 'message',
        dataIndex: 'message',
        title: t("website.feedback.field.message"),
        width: 250,
        render: (_, record) => <span className="line-clamp-2">{record.message}</span>
      },
      {
        key: 'action',
        title: t('common.action'),
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space key={record.id}>
            <ButtonIcon typeIcon="edit" disabled={!permission[PERMISSION_ACTION.update]} onClick={() => onEdit(record)} />
               <Popconfirm
                placement="bottomRight"
                title={t("common.title_delete")}
                okText={t("common.ok")}
                onConfirm={() => onDelete(record)}
                cancelText={t("common.cancel")}
              >
                <ButtonIcon typeIcon="delete" disabled={!permission[PERMISSION_ACTION.delete]} />
              </Popconfirm>
          </Space>
        ),
      },
    ])
  }, [t]);

  const reload = () => {
    fetchBlog();
  };

  const onCreate = () => {
    refDetail.current.create()
  };
  
  const onEdit = (formValue: IFeedback) => {
    refDetail.current.update({ ...formValue })
  };

  const onDelete = async (formValue: IFeedback) => {
    if(!formValue.id) return;
    try {
      setLoading(true);
      const res = await deleteFeedback(formValue.id);
      if(res) reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onCheck = async (value: boolean, data: any) => {
    const _param = _.cloneDeep(data);
    _param.show = value;
    try {
      const res = await updateFeedback(data.id, _param);
      if(res) reload();
    } catch (error) {
      console.error(error);
    }
  }

  const onSelect = async (value: string, data: any) => {
    const _param = _.cloneDeep(data);
    _param.type = value;
    try {
      const res = await updateEmployee(data.id, _param);
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

  const onChangeType = (value: string) => {
    setLazyParams({
      ...lazyParams,
      type: value,
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
                  {t('website.feedback.create')}
                </Button>
              </Space>
              <Space>
                <Input placeholder={t('common.search')} suffix={<SearchOutlined className="text-gray-400" /> } onChange={(e) => onChangeSearch(e.target.value)} />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.type')}
                  options={TYPE_FFEDBACK.list.map(item => ({label: t(item.label), value: item.value}))} 
                  fieldNames={{ label: 'label', value: 'value' }}
                  onChange={(value) => onChangeType(value)}
                />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.hide_column')} 
                  mode="multiple"
                  maxTagCount={1}
                  options={Object.keys(t('website.feedback.field', { returnObjects: true })).map((key) => ({
                    value: key,
                    label: t(`website.feedback.field.${key}`),
                  }))}
                  onChange={(value) => onChangeHide(value)}
                />
              </Space>
            </Flex>
            <Table
              rowKey="id"
              size="small"
              className="relative"
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
              columns={columns}
              dataSource={data}
            />
          </Flex>
        </div>
        <FeedbackDetail 
          ref={refDetail} 
          reload={reload}
        />
      </RegionCenter>
    </Region>
  );
};

export default Feedback;
