import { Typography } from 'antd';
import Color from 'color';

import Card from '@/components/card';
import { Iconify } from '@/components/icon';
import { useThemeToken } from '@/theme/hooks';
import { no_avatar } from '@/assets/images';
import { useEffect, useState } from 'react';
import { fCurrencyVN } from '@/utils/format-number';
import { useTranslation } from 'react-i18next';

export default function TopAuthor({ data }: { data: any | [] }) {
  const [customers, setCustomers] = useState([]);
  const themeToken = useThemeToken();
  const { t } = useTranslation();

  useEffect(() => {
    setCustomers(data || []);
  }, [data]);
  
  const getTrophyIconColor = (index: number) => {
    switch (index) {
      case 1:
        return {
          color: themeToken.colorInfo,
          bg: themeToken.colorInfoBgHover,
        };
      case 2: {
        return {
          color: themeToken.colorError,
          bg: themeToken.colorErrorBgHover,
        };
      }
      default:
        return {
          color: themeToken.colorPrimary,
          bg: themeToken.colorPrimaryBgHover,
        };
    }
  };
  return (
    <Card className="flex-col">
      <header className="self-start mb-1">
        <Typography.Title level={5}>{t('dashboard.top_customers')}</Typography.Title>
      </header>
      <main className="w-full">
        {customers?.map((item: any, index: number) => (
          <div key={index} className="mb-2 flex">
            <img src={item.avatar || no_avatar} alt="avatar" className="h-10 w-10 rounded-full" />
            <div className="ml-2 flex flex-col font-roboto">
              <span>{item.firstname + ' ' + item.lastname}</span>
              <span className='font-medium'>
                {fCurrencyVN(item.totalSpent || 0)}
              </span>
            </div>

            <div
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background: Color(getTrophyIconColor(index).bg).alpha(0.4).toString(),
              }}
            >
              <Iconify
                icon="solar:cup-star-bold"
                size={24}
                color={getTrophyIconColor(index).color}
              />
            </div>
          </div>
        ))}
      </main>
    </Card>
  );
}
