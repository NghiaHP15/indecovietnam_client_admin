import { CategoriesType } from '#/entity';
import Icons from '@/assets/icons';

import ButtonIcon from '@/components/ButtonIcon';
import PageSizeOption from '@/components/PageSizeOptions';
import Region, { RegionCenter, RegionTop } from '@/layouts/_common/Region';
import Card from '@/pages/components/card';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Space, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const categoriesData: CategoriesType[] = Array.from({ length: 50 }, (_, index) => ({
  id: index.toString(),
  name: `Category ${index + 1}`,
  description: `This is the description for category ${index + 1}`,
  updated_at: new Date().toISOString(),
  updated_by: `User ${index + 1}`,
}));

function Categories() {
  const { t } = useTranslation();
  const [lazyParams, setLazyParams] = useState({
    page: 0,
    size: 10,
  });
  const [data, setData] = useState<CategoriesType[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setData(categoriesData);
  };

  const onPage = (page: number, pageSize: number) => {
    setLazyParams({
      ...lazyParams,
      page: page - 1,
      size: pageSize,
    });
  };
  const columns: ColumnType<CategoriesType>[] = [
    {
      key: 'index',
      title: '#',
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      key: 'id',
      title: t('inventory.categories.id'),
      dataIndex: 'id',
      width: 150,
    },
    {
      key: 'name',
      title: t('inventory.categories.name'),
      render: (_, record) => <span className="font-bold text-[#E82927]">{record.name}</span>,
    },
    {
      key: 'name',
      title: "Parent_Category_ID",
      render: (_, record) => <span className="font-bold text-[#E82927]">{record.name}</span>,
    },
    {
      key: 'name',
      title: "Full_Category_Path",
      render: (_, record) => <span className="font-bold text-[#E82927]">{record.name}</span>,
    },
    {
      key: 'description',
      title: t('inventory.categories.description'),
      dataIndex: 'description',
    },
    {
      key: 'description',
      title: "Image",
      dataIndex: 'description',
    },
    {
      key: 'description',
      title: "Category_Type",
      dataIndex: 'description',
    },
    {
      key: 'description',
      title: "Product_Count",
      dataIndex: 'description',
    },
    {
      key: 'description',
      title: "Category_Status",
      dataIndex: 'description',
    },
    {
      key: 'description',
      title: "Tax_Class_ID",
      dataIndex: 'description',
    },
    {
      key: 'description',
      title: "Regulatory_Requirements",
      dataIndex: 'description',
    },
    {
      key: 'description',
      title: "Country_Restriction",
      dataIndex: 'description',
    },
    {
      key: 'updated_at',
      title: t('inventory.categories.update_at'),
      dataIndex: 'updated_at',
    },
    {
      key: 'updated_by',
      title: t('inventory.categories.update_by'),
      dataIndex: 'updated_by',
      width: 150,
    },
    {
      key: 'action',
      title: t('common.action'),
      fixed: 'right',

      render: (_, record) => (
        <Space key={record.id}>
          <ButtonIcon typeIcon="edit" href="/inventory/categories/edit/:123" />
          <ButtonIcon typeIcon="delete" />
        </Space>
      ),
    },
  ];
  const changePageSize = (pageSize: number) => {
    setLazyParams({
      ...lazyParams,
      size: pageSize,
    });
  };
  return (
    <Region>
      <RegionTop>
        <Flex justify="end" className="mb-5 mt-3">
          <Button icon={<PlusCircleOutlined />} type="primary">
            {t('common.create')}
          </Button>
        </Flex>
      </RegionTop>
      <RegionCenter>
        <Card className='q-region pb-0'>
          <RegionTop>
            <Flex justify="space-between" className="mb-5">
              <PageSizeOption pageSize={lazyParams.size} onChange={changePageSize} />
              <div>
                <Input placeholder={t('common.search')} suffix={<Icons.Search />} />
              </div>
            </Flex>
          </RegionTop>
          <RegionCenter>
            <Table
              rowKey="id"
              size="small"
              scroll={{ x: 'max-content', y: '100%' }}
              pagination={{
                responsive: true,
                total: data.length,
                pageSize: lazyParams.size,
                size: 'small',
                current: lazyParams.page + 1,
                showTotal: (total) => (
                  <div className="absolute left-1">
                    <Typography.Text className="text-sm font-normal">
                      {t('common.showing')}{' '}
                      {total > 0
                        ? `${lazyParams.page * lazyParams.size + 1} - ${Math.min(
                            (lazyParams.page + 1) * lazyParams.size,
                            total,
                          )}(${total})`
                        : '0 / 0'}
                    </Typography.Text>
                  </div>
                ),
                onChange: onPage,
              }}
              columns={columns}
              dataSource={data}
            />
          </RegionCenter>
        </Card>
      </RegionCenter>
    </Region>
  );
}

export default Categories;
