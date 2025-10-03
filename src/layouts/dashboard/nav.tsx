import { MenuOutlined } from '@ant-design/icons';
import { Avatar, ConfigProvider, Menu, MenuProps } from 'antd';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useLocation, useMatches, useNavigate } from 'react-router-dom';
import Scrollbar from '@/components/scrollbar';
import { useRouteToMenuFn, usePermissionRoutes } from '@/router/hooks';
import { menuFilter } from '@/router/utils';
import { useSettingActions, useSettings } from '@/store/settingStore';
import { useThemeToken } from '@/theme/hooks';
import { NAV_COLLAPSED_WIDTH, NAV_WIDTH } from './config';
import { ThemeLayout } from '#/enum';
import { logo_indecovietnam } from '@/assets/images';

type Props = {
  closeSideBarDrawer?: () => void;
};
export default function Nav(props: Props) {
  const navigate = useNavigate();
  const matches = useMatches();
  const { pathname } = useLocation();

  // @ts-ignore
  const { colorPrimary, colorTextBase, colorBgBase, colorBgElevated, colorBorder } = useThemeToken();

  const settings = useSettings();
  const { themeLayout } = settings;
  const { setSettings } = useSettingActions();

  const colorBgMenu: string = '#131313';

  const menuStyle: CSSProperties = {
    background: colorBgMenu,
  };

  const routeToMenuFn = useRouteToMenuFn();
  const permissionRoutes = usePermissionRoutes();
  const menuList = useMemo(() => {
    const menuRoutes = menuFilter(permissionRoutes);
    return routeToMenuFn(menuRoutes?.filter(e => e.path !== 'system'))
  }, [routeToMenuFn, permissionRoutes]);
  
  /**
   * state
   */
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [menuMode, setMenuMode] = useState<MenuProps['mode']>('inline');

  useEffect(() => {
    if (themeLayout === ThemeLayout.Vertical) {
      const openKeys = matches
        .filter((match) => match.pathname !== '/')
        .map((match) => match.pathname);
      setOpenKeys(openKeys);
    }
  }, [matches, themeLayout]);

  useEffect(() => {
    if (themeLayout === ThemeLayout.Vertical) {
      setCollapsed(false);
      setMenuMode('inline');
    }
    if (themeLayout === ThemeLayout.Mini) {
      setCollapsed(true);
      setMenuMode('inline');
    }
  }, [themeLayout]);

  /**
   * events
   */
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys);
  };
  const onClick: MenuProps['onClick'] = ({ key }) => {
    
    // const nextLink = flattenedRoutes?.find((el) => el.key === key);

    // if (nextLink?.hideTab && nextLink?.frameSrc) {
    //   window.open(nextLink?.frameSrc, '_blank');
    //   return;
    // }

    navigate(key);
    props?.closeSideBarDrawer?.();
  };

  const setThemeLayout = (themeLayout: ThemeLayout) => {
    setSettings({
      ...settings,
      themeLayout,
    });
  };

  const toggleCollapsed = () => {
    if (!collapsed) {
      setThemeLayout(ThemeLayout.Mini);
    } else {
      setThemeLayout(ThemeLayout.Vertical);
    }
    setCollapsed(!collapsed);
  };
  return (
    <div
      className="flex h-full flex-col transition-all transition-duration-300"
      style={{
        background: colorBgMenu,
        width: collapsed ? NAV_COLLAPSED_WIDTH : NAV_WIDTH,
      }}
    >
      <div className="relative flex h-35 items-center justify-center">
        <div className='w-full mx-5 py-2 border-dashed border-b flex justify-center items-center' style={{borderColor: "#2b2b2b"}}>
          <Avatar src={logo_indecovietnam} shape="square" className="transition-all transition-duration-300" style={{width: collapsed ? 80 : 200, height: "auto"}} />
        </div>
        <button
          onClick={toggleCollapsed}
          className="absolute top-2 z-50 hidden h-6 w-6 cursor-pointer select-none rounded-full text-center md:block"
          style={{ color: colorTextBase, borderColor: colorTextBase, fontSize: 18, right: -40 }}
        >
          <MenuOutlined size={20} style={{ color: colorTextBase }} />
        </button>
      </div>

      <Scrollbar
        style={{height: 'calc(100% - 180px)'}}
      >
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemColor: collapsed ? colorTextBase : "#fff",
                itemHoverBg: colorPrimary,
                itemHoverColor: "#fff",
                itemActiveBg: colorPrimary,
                subMenuItemBorderRadius: 8,
                itemPaddingInline: 23,
                itemHeight: 44,
                collapsedWidth: NAV_COLLAPSED_WIDTH,
                itemSelectedColor: "#fff",
                itemSelectedBg: colorPrimary,
              },
            },
          }}
        >
          <Menu
            mode={menuMode}
            theme="light"
            items={menuList}
            className='!mt-4 !border-none'
            defaultOpenKeys={openKeys}
            defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={onClick}
            style={menuStyle}
            inlineCollapsed={collapsed}
          />
        </ConfigProvider>
      </Scrollbar>
        {
          collapsed ? 
          <></> : 
          <div className="flex flex-col justify-center items-center text-sm mx-7 mt-2 py-6 border-dashed border-t" style={{color: "#fff", borderColor: "#2b2b2b"}}>
            <span>Version v 0.0.1</span>
            <span>@2025 Design by Machi</span>
          </div>
        } 
    </div>
  );
}
