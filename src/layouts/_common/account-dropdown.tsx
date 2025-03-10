import { Avatar, Divider, MenuProps } from 'antd';
import Dropdown, { DropdownProps } from 'antd/es/dropdown/dropdown';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginStateContext } from '@/pages/sys/login/providers/LoginStateProvider';
import { useRouter } from '@/router/hooks';
import { useUserInfo, useUserActions } from '@/store/userStore';
import { useThemeToken } from '@/theme/hooks';
// import AccessLogService from '@/api/services/accessLogService.ts';
import avatar from '../../assets/images/avatar.png';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { colorPrimarys } from '@/theme/antd/theme';
// import accessLogService from '@/api/services/accessLogService';

/**
 * Account Dropdown
 */
// interface AccountDropdownProps {
//   websocket?: WebSocket;
// }
export default function AccountDropdown() {
  const { replace } = useRouter();
  const { userName, fullName } = useUserInfo();
  
  const { clearUserInfoAndToken } = useUserActions();
  const { backToLogin } = useLoginStateContext();
  const { t } = useTranslation();

  const logout = async () => {
    try {
      // todo const logoutMutation = useMutation(userService.logout);
      // todo logoutMutation.mutateAsync();
      // await accessLogService.logOut();
      clearUserInfoAndToken();
      backToLogin();
    } catch (error) {
      console.log(error);
    } finally {
      replace('/login');
    }
  };
  const { colorBgElevated, borderRadiusLG, boxShadowSecondary, colorTextBase, colorPrimary } = useThemeToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const dropdownRender: DropdownProps['dropdownRender'] = (menu) => (
    <div style={contentStyle}>
      <div className="mx-2 py-2 border-dashed border-b" style={{width: "160px", borderColor: "#ccc"}}>
        <div className='flex items-center'>
          <Avatar src={avatar} shape="square" size={40} />
          <div className="flex flex-col items-start ml-2">
            <span className='text-sm capitalize' style={{color: colorTextBase}}>{userName}</span>
            <span className="text-sm font-bold text-gray" style={{color: colorTextBase, opacity: 0.6}}>{fullName}</span>
          </div>
        </div>
      </div>
      {/* <Divider color="#f0f0f0" style={{ margin: 0 }} /> */}
      {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
    </div>
  );

  const items: MenuProps['items'] = [
    {
      label: <button className="font-bold w-full" style={{color: colorPrimary}}>{t('common.login.logout')}</button>,
      key: '4',
      icon: <LogoutOutlined className="text-warning" style={{fontSize: '18px', color: colorPrimary}} />,
      onClick: logout,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} dropdownRender={dropdownRender} arrow>
      <div className='h-full cursor-pointer flex items-center'>
        <Avatar size={34} shape='circle' src={avatar} alt="" />
        <span className="hidden md:inline-block font-normal capitalize px-2" style={{color: colorTextBase}}>{userName}</span>
        <DownOutlined style={{color: colorTextBase, fontSize: 11, fontWeight: 'bold'}}/>
      </div>
    </Dropdown>
  );
}
