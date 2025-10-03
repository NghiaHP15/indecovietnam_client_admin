import { Avatar, Button, Drawer, Flex, notification } from 'antd';
import Color from 'color';
import { CSSProperties, useEffect, useState } from 'react';

import { IconButton, SvgIcon } from '@/components/icon';
// import LocalePicker from '@/components/locale-picker';
import Logo from '@/components/logo';
import { useSettings } from '@/store/settingStore';
import { useResponsive, useThemeToken } from '@/theme/hooks';

import AccountDropdown from '../_common/account-dropdown';
import BreadCrumb from '../_common/bread-crumb';
import NoticeButton from '../_common/notice';
// import SettingButton from '../_common/setting-button';

import { HEADER_HEIGHT, NAV_COLLAPSED_WIDTH, NAV_WIDTH, OFFSET_HEADER_HEIGHT } from './config';


import { NOTI_TYPE, ThemeLayout } from '#/enum';
// import { useUserInfo } from '@/store/userStore';
// import Language from '../_common/language';
import LocalePicker from '@/components/locale-picker';
import { no_avatar } from '@/assets/images';
import Fullscreen from '../_common/fullscreen';
import LightDark from '../_common/lightdark';
import { ChromeOutlined } from '@ant-design/icons';
// import SettingButton from '../_common/setting-button';
// import { useUserActions } from '@/store/userStore';

type Props = {
  className?: string;
  offsetTop?: boolean;
};

interface CustomNotificationProps {
  message: string;
  name: string;
  avatarUrl?: string;
}

const { VITE_APP_WS: WS } = import.meta.env;

export default function Header({ className = '', offsetTop = false }: Props) {
  const [ drawerOpen, setDrawerOpen] = useState(false);
  const { themeLayout, breadCrumb } = useSettings();
  const { colorBorder, colorPrimaryBg, colorTextDescription } = useThemeToken();
  const { screenMap } = useResponsive();
  const [websocket, setWebsocket] = useState<WebSocket>();
  const [ reload, setReload] = useState(false);

  let shouldReconnect = true;

  const connectWs = () => {
    if (websocket && websocket.readyState === websocket.OPEN) {
      return;
    }
    const url = WS;
    
    var ws = new WebSocket(url);

    setWebsocket(ws);

    // ws.onopen = () => {
    //   var token = JSON.parse(localStorage.getItem('token') as string)
    //   console.log("==========Socket Token=========>", token);
    //   ws.send(token);
    //   // setInterval(() => {
    //   //   if (ws.readyState === WebSocket.OPEN) {
    //   //     console.log("---- Socket alive");
    //   //     ws.send(JSON.stringify({ type: 'ping' }));  // Bạn có thể thay đổi loại tin nhắn tùy theo yêu cầu server
    //   //   }
    //   // }, 1000);
    // };

    ws.onmessage = (event: any) => {
      const newMessage = JSON.parse(event.data);
      console.log("📩 New message:", newMessage);
      // debugger
      const { type, message, name, avatar } = newMessage;
      if(type === NOTI_TYPE.ORDER) {
        notification.success({
          message: message ?? "📦 Bạn có thông báo đơn hàng mới",
          duration: 3,
        });
      } else if (type === NOTI_TYPE.CONTACT) {
        openCustomNotification({
          message,
          name,
          avatarUrl: avatar,
        })
      } else {
        openCustomNotification({
          message,
          name,
          avatarUrl: avatar,
        })
      }
      
      setReload(true);
    };

    ws.onclose = () => {
      if (shouldReconnect) {
        setTimeout(() => connectWs(), 2000);
      }
    };
    ws.onerror = (_) => ws?.close();
  };

  useEffect(() => {
    connectWs();
  }, []);

  const openCustomNotification = ({
    message,
    name,
    avatarUrl,
  }: CustomNotificationProps) => {
    notification.open({
      message: (
        <div className="flex items-center gap-3">
          <Avatar src={avatarUrl || no_avatar} shape="square" size={40} />
          <div className="flex flex-col">
            <span className="font-medium">{message}</span>
            <span className="text-sm">{name}</span>
          </div>
        </div>
      ),
      description: null, // bỏ description nếu không dùng
      placement: "bottomRight",
      duration: 4, // tự tắt sau 3s
    });
  };

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
          <div className="flex items-center">
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
            <Flex wrap="nowrap" gap={8} align="center">
              <Button icon={<ChromeOutlined style={{ color: colorTextDescription }} />} onClick={() => window.open('https://indecovietnam-client.vercel.app/')} />
              <Fullscreen />
              <LightDark />
              <LocalePicker />
              <NoticeButton websocket={websocket} reload={reload} />
              <AccountDropdown />
            </Flex>
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
