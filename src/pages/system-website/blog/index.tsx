import { useEffect, useRef, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Button, Checkbox, Flex, Image, Input, Popconfirm, Select, Space, Table, Typography } from "antd";
import PageSizeOption from "@/components/PageSizeOptions";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import { IBlog } from "#/entity";
import { ColumnType } from "antd/es/table";
import ButtonIcon from "@/components/ButtonIcon";
import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { deleteBlog, internalBlogs, updateBlog }  from "@/api/services/blogService";
import { no_image } from "@/assets/images";
import { useDebounce } from "@/router/hooks";
import BlogDetail from "./detail";
import { PERMISSION_ACTION, ROUTE_NAME } from "@/_mock/assets";
import { usePermission } from "@/store/userStore";
import _ from "lodash";
import { formatDate } from "@/utils/format-date";

type PropKey = keyof IBlog;

const Blog = () => {
  const { t } = useTranslation ();
  const { colorBorder, colorPrimary, colorTextLightSolid, colorBgContainer, colorBgElevated } = useThemeToken();
  const [columns, setColumns] = useState<ColumnType<IBlog>[]>([]);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 20,
    search: "",
    limit: 1000,
  });
  const [data, setData] = useState<IBlog[]>([]);
  const debouncedValue = useDebounce(lazyParams.search, 500);
  const refDetail = useRef<any>();
  const permission: any = usePermission(ROUTE_NAME.Blog);

  const fetchBlog = async () => {
    try{
      setLoading(true);
      const res = await internalBlogs({limit: lazyParams.limit, search: debouncedValue});
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

  useEffect(() => {
    setColumns([
      {
        key: 'index',
        title: '#',
        render: (_, __, index) => <span>{index + 1}</span>,
        width: 50,
      },
      {
        key: 'title',
        title: t('website.blog.field.title'),
        dataIndex: 'title',
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.title}</span>
      },
      {
        key: 'slug',
        dataIndex: 'slug',
        title: t('website.blog.field.slug'),
        hidden: true,
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.slug}</span>
      },
      {
        key: 'image',
        dataIndex: 'image',
        title: t("website.blog.field.image"),
        width: 150,
        render: (_, record) => (
          <div className="flex items-center rounded-md w-max h-max overflow-hidden">
            <Image src={record.image || no_image} width={100}  className=" overflow-hidden" />
          </div>
        )
      },
      {
        key: 'description',
        dataIndex: 'description',
        title: t("website.blog.field.description"),
        width: 250,
        render: (_, record) => <span className="line-clamp-2">{record.description}</span>
      },
      {
        key: 'latest_blog',
        dataIndex: 'latest_blog',
        align: 'center',
        title: t("website.blog.field.latest_blog"),
        width: 100,
        render: (_, record) => <Checkbox checked={record.latest_blog} onChange={(e) => onCheck(e.target.checked, record)} />
      },
      {
        key: 'published_at',
        dataIndex: 'published_at',
        title: t("website.blog.field.published_at"),
        width: 150,
        render: (_, record) => <span>{formatDate(record.published_at.toString())}</span>
      },
      {
        key: 'category',
        dataIndex: 'category',
        title: t("website.blog.field.category"),
        width: 150,
        render: (_, record) => <span>{record.category?.title}</span>
      },
      {
        key: 'author',
        dataIndex: 'author',
        title: t("website.blog.field.author"),
        width: 150,
        render: (_, record) => <span>{record.author?.fullname}</span>
      },
      {
        key: 'tag',
        dataIndex: 'tag',
        title: t("website.blog.field.tag"),
        width: 250,
        render: (_, record) => <span className="line-clamp-2">{record.tag?.join(', ')}</span>
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
  
  const onEdit = (formValue: IBlog) => {
    refDetail.current.update({ ...formValue })
  };

  const onDelete = async (formValue: IBlog) => {
    if(!formValue.id) return;
    try {
      setLoading(true);
      const res = await deleteBlog(formValue.id);
      if(res) reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onCheck = async (value: boolean, data: any) => {
    const _param = _.cloneDeep(data);
    _param.latest_blog = value;
    try {
      const res = await updateBlog(data.id, _param);
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
                  Thêm bài viết
                </Button>
              </Space>
              <Space>
                <Input placeholder={t('common.search')} suffix={<SearchOutlined className="text-gray-400" /> } onChange={(e) => onChangeSearch(e.target.value)} />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.hide_column')} 
                  mode="multiple"
                  maxTagCount={1}
                  options={Object.keys(t('website.blog.field', { returnObjects: true })).map((key) => ({
                    value: key,
                    label: t(`website.blog.field.${key}`),
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
        <BlogDetail 
          ref={refDetail} 
          reload={reload}
        />
      </RegionCenter>
    </Region>
  );
};

export default Blog;
