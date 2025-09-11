import { useEffect, useRef, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Button, ConfigProvider, Flex, Image, Input, Popconfirm, Select, Space, Table, Tabs, Typography } from "antd";
import PageSizeOption from "@/components/PageSizeOptions";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import { IGallery } from "#/entity";
import { ColumnType } from "antd/es/table";
import ButtonIcon from "@/components/ButtonIcon";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import Icons from "@/assets/icons";
import { no_image } from "@/assets/images";
import { useDebounce } from "@/router/hooks";
import GalleryDetail from "./detail";
import { PERMISSION_ACTION, ROUTE_NAME } from "@/_mock/assets";
import { usePermission } from "@/store/userStore";
import _ from "lodash";
import { deleteGallery, internalGallerys, updateGallery } from "@/api/services/galleryService";
import { TYPE_GALLERY } from "#/enum";

type PropKey = keyof IGallery;

const Gallery = () => {
  const { t } = useTranslation ();
  const { colorBorder, colorPrimary, colorTextLightSolid, colorBgContainer, colorBgElevated, colorTextBase } = useThemeToken();
  const [columns, setColumns] = useState<ColumnType<IGallery>[]>([]);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 20,
    search: "",
    type: TYPE_GALLERY.SLIDER,
    limit: 1000,
  });
  const [data, setData] = useState<IGallery[]>([]);
  const debouncedValue = useDebounce(lazyParams.search, 500);
  const refDetail = useRef<any>();
  const permission: any = usePermission(ROUTE_NAME.Gallery);

  const fetchGallery = async () => {
    try{
      setLoading(true);
      const res = await internalGallerys({limit: lazyParams.limit, search: debouncedValue, type: lazyParams.type});
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
    fetchGallery();
  }, [lazyParams.limit, lazyParams.type, debouncedValue]);

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
        title: t('website.gallery.field.title'),
        dataIndex: 'title',
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.title}</span>
      },
      {
        key: 'image',
        dataIndex: 'image',
        title: t("website.gallery.field.image"),
        width: 200,
        render: (_, record) => (
          <div className="flex items-center rounded-md w-max h-max overflow-hidden">
            <Image src={record.image || no_image} height={100} />
          </div>
        )
      },
      {
        key: 'description',
        title: t('website.gallery.field.description'),
        dataIndex: 'description',
        hidden: lazyParams.type === TYPE_GALLERY.SOCIAL,
        width: 200,
        render: (_, record) => <span className="line-clamp-2">{record.description}</span>
      },
      {
        key: 'href',
        title: t('website.gallery.field.href'),
        dataIndex: 'description',
        hidden: lazyParams.type === TYPE_GALLERY.SOCIAL || lazyParams.type === TYPE_GALLERY.DESIGN,
        width: 150,
        render: (_, record) => <span className="line-clamp-2">{record.href}</span>
      },
      {
          key: 'type',
          dataIndex: 'type',
          title: t('website.gallery.field.type'),
          width: 150,
          render: (_, record) =>(
          <Select 
            className="w-full"
            value={record.type} 
            options={TYPE_GALLERY.list.map(item => ({label: t(item.label), value: item.value}))} 
            fieldNames={{ label: 'label', value: 'value' }}
            onChange={(value) => onSelect(value, record)}
            />
          )
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
  }, [t, lazyParams.type]);

  const reload = () => {
    fetchGallery();
  };

  const onCreate = () => {
    refDetail.current.create();
  };
  
  const onEdit = (formValue: IGallery) => {
    refDetail.current.update({ ...formValue })
  };

  const onDelete = async (formValue: IGallery) => {
    if(!formValue.id) return;
    try {
      setLoading(true);
      const res = await deleteGallery(formValue.id);
      if(res) reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const onSelect = async (value: string, data: any) => {
    const _param = _.cloneDeep(data);
    _param.type = value;
    try {
      const res = await updateGallery(data.id, _param);
      if(res) reload();
    } catch (error) {
      console.error(error);
    }
  }

  const tabs = [
    {
      key: TYPE_GALLERY.SLIDER,
      label: t('website.gallery.type.slider'),
      Children: <></>
    },
    {
      key: TYPE_GALLERY.BANNER,
      label: t('website.gallery.type.banner'),
      Children: <></>
    },
    {
      key: TYPE_GALLERY.DESIGN,
      label: t('website.gallery.type.design'),
      Children: <></>
    },
    {
      key: TYPE_GALLERY.SOCIAL,
      label: t('website.gallery.type.social'),
      Children: <></>
    }
  ]
  
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
                  {t('website.gallery.create')}
                </Button>
              </Space>
              <Space>
                <Input placeholder={t('common.search')} suffix={<Icons.Search /> } onChange={(e) => onChangeSearch(e.target.value)} />
                <Select 
                  style={{ width: 200 }} 
                  placeholder={t('common.hide_column')} 
                  mode="multiple"
                  maxTagCount={1}
                  options={Object.keys(t('website.gallery.field', { returnObjects: true })).map((key) => ({
                    value: key,
                    label: t(`website.gallery.field.${key}`),
                  }))}
                  onChange={(value) => onChangeHide(value)}
                />
              </Space>
            </Flex>
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    itemColor: colorTextBase
                  },
                },
              }}
            >
            <Tabs 
              items={tabs} 
              style={{ color: colorTextBase }}
              activeKey={lazyParams.type}
              onChange={(key) => {
                setLazyParams({
                  ...lazyParams,
                  type: key
                })
              }}
            />
            </ConfigProvider>
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
        <GalleryDetail
          ref={refDetail} 
          reload={reload}
        />
      </RegionCenter>
    </Region>
  );
};

export default Gallery;
