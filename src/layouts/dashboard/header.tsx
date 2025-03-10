import { Drawer, Space } from 'antd';
import Color from 'color';
import { CSSProperties, useEffect, useState } from 'react';

import { IconButton, SvgIcon } from '@/components/icon';
// import LocalePicker from '@/components/locale-picker';
import Logo from '@/components/logo';
import { useSettings } from '@/store/settingStore';
import { useResponsive, useThemeToken } from '@/theme/hooks';

import AccountDropdown from '../_common/account-dropdown';
import BreadCrumb from '../_common/bread-crumb';
// import NoticeButton from '../_common/notice';
// import SettingButton from '../_common/setting-button';

import { HEADER_HEIGHT, NAV_COLLAPSED_WIDTH, NAV_WIDTH, OFFSET_HEADER_HEIGHT } from './config';


import { ThemeLayout } from '#/enum';
// import { useUserInfo } from '@/store/userStore';
// import Language from '../_common/language';
import LocalePicker from '@/components/locale-picker';
import SettingButton from '../_common/setting-button';
// import SettingButton from '../_common/setting-button';
// import { useUserActions } from '@/store/userStore';

type Props = {
  className?: string;
  offsetTop?: boolean;
};

export default function Header({ className = '', offsetTop = false }: Props) {
  const [ drawerOpen, setDrawerOpen] = useState(false);
  const { themeLayout, breadCrumb } = useSettings();
  const { colorBorder, colorPrimaryBg } = useThemeToken();
  const { screenMap } = useResponsive();
  // const [websocket, setWebsocket] = useState<WebSocket>();
  // const { fullName } = useUserInfo();
  const [ _setReload] = useState(false);

  // let shouldReconnect = true;

  const connectWs = () => {
    // if (websocket && websocket.readyState === websocket.OPEN) {
    //   return;
    // }
    // // const url = `ws:${import.meta.env.VITE_APP_BASE_API.replace('https:', '')}/ws`;
    // const url = 'wss://dev-control-center.xdp.vn/api/ws';
    // var ws = new WebSocket(url);

    // setWebsocket(ws);

    // ws.onopen = () => {
    //   var token = JSON.parse(localStorage.getItem('token') as string).accessToken;
    //   console.log("==========Socket Token=========>", token);
    //   ws.send(token);
    //   setInterval(() => {
    //     if (ws.readyState === WebSocket.OPEN) {
    //       // console.log("---- Socket alive");
    //       // ws.send(JSON.stringify({ type: 'ping' }));  // Bạn có thể thay đổi loại tin nhắn tùy theo yêu cầu server
    //     }
    //   }, 1000);
    // };

    // ws.onmessage = (event: any) => {
    //   const newMessage = JSON.parse(event.data);
    //   console.log(newMessage);
    //   // debugger
    //   if (newMessage.type == 'LOGOUT') {
    //     shouldReconnect = false
    //     ws.close();
    //   }

    //   if (newMessage.type == 'NOTIFICATION') {
    //     notification.success({
    //       message: newMessage.content ?? 'Bạn có thông báo mới',
    //       duration: 3,
    //     });
    //     setReload(true);
    //   }
    // };

    // ws.onclose = () => {
    //   if (shouldReconnect) {
    //     setTimeout(() => connectWs(), 2000);
    //   }
    // };
    // ws.onerror = (_) => ws?.close();
  };

  useEffect(() => {
    connectWs();
  }, []);

  const headerStyle: CSSProperties = {
    position: themeLayout === ThemeLayout.Horizontal ? 'relative' : 'fixed',
    borderBottom:
      themeLayout === ThemeLayout.Horizontal
        ? `1px dashed ${Color(colorBorder).alpha(0.6).toString()}`
        : '',
    boxShadow: '0px 0px 20px 0px #0000001A',
    backgroundColor: colorPrimaryBg,
  };

  if (themeLayout === ThemeLayout.Horizontal) {
    headerStyle.width = '100vw';
  } else if (screenMap.md) {
    headerStyle.right = '0px';
    headerStyle.left = 'auto';
    headerStyle.width = `calc(100% - ${themeLayout === ThemeLayout.Vertical ? NAV_WIDTH : NAV_COLLAPSED_WIDTH
      }px)`;
  } else {
    headerStyle.width = '100vw';
  }

  return (
    <>
      <header className={`z-20 w-full ${className}`} style={headerStyle}>
        <div
          className="flex flex-grow items-center justify-between px-4 text-gray backdrop-blur xl:px-6 2xl:px-10"
          style={{
            height: offsetTop ? OFFSET_HEADER_HEIGHT : HEADER_HEIGHT,
            transition: 'height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          }}
        >
          <div className="flex items-baseline">
            {themeLayout !== ThemeLayout.Horizontal ? (
              <IconButton onClick={() => setDrawerOpen(true)} className="h-10 w-10 md:hidden">
                <SvgIcon icon="ic-menu" size="24" />
              </IconButton>
            ) : (
              <Logo />
            )}
            <div className="ml-7 hidden md:block">{breadCrumb ? <BreadCrumb /> : null}</div>
          </div>

          <div className="flex items-center">
            <Space>
              {/* <NoticeButton reload={reload} /> */}
              {/* <AccountDropdown websocket={websocket} /> */}
              <LocalePicker />
              <AccountDropdown />
            </Space>
          </div>
        </div>
      </header>
      <Drawer
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        closeIcon={false}
        styles={{
          header: {
            display: 'none',
          },
          body: {
            padding: 0,
            overflow: 'hidden',
          },
        }}
        width="auto"
      >
        {/* <Nav closeSideBarDrawer={() => setDrawerOpen(false)} /> */}
      </Drawer>
    </>
  );
}
