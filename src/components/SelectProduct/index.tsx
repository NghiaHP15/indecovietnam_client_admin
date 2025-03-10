import { Select, Spin } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useEffect, useState } from 'react';
import { SelectProps } from 'antd/lib';
import { Product } from '#/entity';
import { useTranslation } from 'react-i18next';
import productService from '@/api/services/productService';

const SelectProduct = forwardRef<any, SelectProps>(({ ...props }, ref) =>{

  const queryClient = useQueryClient()
  
  const {t} = useTranslation()

  const [lazyParams, setLazyParams] = useState({page: 1,size: 10});

  const [products, setProducts] = useState<Product[]>([]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', lazyParams],
    queryFn: () => productService.internalProducts(lazyParams),
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.items?.length) {
      setProducts((prev) => [...prev, ...data.items]);
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
    queryClient.invalidateQueries({queryKey: ["products"]})
  },[])

  return (
    <Select
    ref={ref}
      showSearch
      optionFilterProp="children"
      loading={isLoading}
      onPopupScroll={handleScroll}
      options={products.map((wh) => ({
        label: wh.name,
        value: wh.id,
      }))}
      notFoundContent={isFetching ? <Spin size="small" /> : t("common.no_data")}
      {...props}
    />
  );
}
)
export default SelectProduct;
