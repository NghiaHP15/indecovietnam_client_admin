import { Tabs, TabsProps } from 'antd';

import { Iconify } from '@/components/icon';

import GeneralTab from './general-tab';
// import NotificationsTab from './notifications-tab';
import SecurityTab from './security-tab';
import { useTranslation } from 'react-i18next';
import { useThemeToken } from '@/theme/hooks';

function UserAccount() {
  const  { t } = useTranslation();
  const themeToken = useThemeToken();
  const { colorPrimary } = themeToken;
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex items-center" style={{ color: colorPrimary }}>
          <Iconify icon="solar:user-id-bold" size={24} className="mr-2" />
          <span>{t('user.account.general')}</span>
        </div>
      ),
      children: <GeneralTab />,
    },
    // {
    //   key: '2',
    //   label: (
    //     <div className="flex items-center">
    //       <Iconify icon="solar:bell-bing-bold-duotone" size={24} className="mr-2" />
    //       <span>Notifications</span>
    //     </div>
    //   ),
    //   children: <NotificationsTab />,
    // },
    {
      key: '2',
      label: (
        <div className="flex items-center" style={{ color: colorPrimary }}>
          <Iconify icon="solar:key-minimalistic-square-3-bold-duotone" size={24} className="mr-2" />
          <span>{t('user.account.security')}</span>
        </div>
      ),
      children: <SecurityTab />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items}/>;
}

export default UserAccount;
