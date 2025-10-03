import { Avatar, Typography } from 'antd';
import { useEffect, useState } from 'react';
import Card from '@/components/card';
import { no_image } from '@/assets/images';
import { useTranslation } from 'react-i18next';

export default function TopInstalled( { data }: { data: any } ) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  return (
    <Card className="flex-col">
      <header className="self-start">
        <Typography.Title level={5}>{t('dashboard.top_products')}</Typography.Title>
      </header>
      <main className="w-full">
        {products.map((item: any) => (
          <div className="mb-[18px] flex items-center justify-between" key={item.id}>
            <div className="flex items-center gap-3">
              <Avatar src={item.image || no_image} shape='square' size={50} />
              <span className="mx-2 font-medium font-roboto">{item.sku}</span>
              <span className='rounded-full' style={{ backgroundColor: item.color.code, height: '15px', width: '15px' }}></span>
            </div>
            {/* <span className="mx-2 font-medium font-roboto">{fCurrencyVN(item.price)}</span> */}
            <span className="mx-2 font-medium font-roboto">{item.quantity_selled}</span>
          </div>
        ))}
      </main>
    </Card>
  );
}
