import { Avatar, MenuProps } from 'antd';
import Dropdown, { DropdownProps } from 'antd/es/dropdown/dropdown';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginStateContext } from '@/pages/sys/login/providers/LoginStateProvider';
import { useRouter } from '@/router/hooks';
import { useUserInfo, useUserActions } from '@/store/userStore';
import { useThemeToken } from '@/theme/hooks';
// import AccessLogService from '@/api/services/accessLogService.ts';
import no_avatar from '../../assets/images/avatar.png';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
// import accessLogService from '@/api/services/accessLogService';

/**
 * Account Dropdown
 */
// interface AccountDropdownProps {
//   websocket?: WebSocket;
// }
export default function AccountDropdown() {
  const { replace } = useRouter();
  const { avatar,fullname, position } = useUserInfo();
  
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
        <div className='flex items-center font-roboto'>
          <Avatar src={avatar || no_avatar} shape="square" size={40} />
          <div className="flex flex-col items-start ml-2">
            <span className='text-sm capitalize' style={{color: colorTextBase}}>{fullname}</span>
            <span className="text-sm font-bold text-gray" style={{color: colorTextBase, opacity: 0.6}}>{position || "Nhân viên"}</span>
          </div>
        </div>
      </div>
      {/* <Divider color="#f0f0f0" style={{ margin: 0 }} /> */}
      {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
    </div>
  );

  const items: MenuProps['items'] = [
    {
      label: <span className='font-roboto'>{t("common.menu.profile")}</span>,
      key: '1',
      onClick: () => replace('/user/profile'),
    },
    {
      label: <span className='font-roboto'>{t("common.menu.account")}</span>,
      key: '2',
      onClick: () => replace('/user/account'),
    },
    { type: 'divider', style: { margin: '4px 0', borderTop: '1px dashed #ccc' } },
    {
      label: <button className="font-bold w-full font-roboto" style={{color: colorPrimary}}>{t('common.login.logout')}</button>,
      key: '3',
      icon: <LogoutOutlined className="text-warning" style={{fontSize: '18px', color: colorPrimary}} />,
      onClick: logout,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} dropdownRender={dropdownRender} arrow>
      <div className='h-full cursor-pointer flex items-center font-roboto'>
        <Avatar size={34} shape='circle' src={avatar || no_avatar} alt="" />
        <span className="hidden md:inline-block font-normal capitalize px-2" style={{color: colorTextBase}}>{fullname}</span>
        <DownOutlined style={{color: colorTextBase, fontSize: 11, fontWeight: 'bold'}}/>
      </div>
    </Dropdown>
  );
}
