import { Select, Spin } from 'antd';
import { useQuery , useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import warehouseService from '@/api/services/warehouseService';
import { SelectProps } from 'antd/lib';
import { Warehouse } from '#/entity';
import { useTranslation } from 'react-i18next';

function SelectWarehouse(props: SelectProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [lazyParams, setLazyParams] = useState({ page: 1, size: 10 });

  const [warehouse, setWarehouse] = useState<Warehouse[]>([]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['warehouse', lazyParams],
    queryFn: () => warehouseService.getWarehouse(lazyParams),
    gcTime: 1000 * 60 * 5,
  });
  
  useEffect(() => {
    if (data?.items?.length) {
      if (data.pageIndex == 1) {
        setWarehouse(() => [...data.items]);
        return;
      }
      setWarehouse((prev) => [...prev, ...data.items]);
    }
  }, [data]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!data?.totalPage) return;
    if (lazyParams.page >= data.totalPage) return;
    const target = event.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10 && !isFetching) {
      setLazyParams((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  useEffect(()=>{
    queryClient.invalidateQueries({queryKey: ["warehouse"]})
  },[])

  return (
    <Select
      showSearch
      optionFilterProp="children"
      loading={isLoading}
      onPopupScroll={handleScroll}
      options={warehouse.map((wh) => ({
        label: wh.name,
        value: wh.id,
      }))}
      notFoundContent={isFetching ? <Spin size="small" /> : t('common.no_data')}
      {...props}
    />
  );
}

export default SelectWarehouse;
