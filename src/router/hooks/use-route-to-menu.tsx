import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Iconify, SvgIcon } from '@/components/icon';
import { useSettings } from '@/store/settingStore';

import { ThemeLayout } from '#/enum';
import { AppRouteObject } from '#/router';
import type { ItemType } from 'antd/es/menu/interface';

/**
 *   routes -> menus
 */
export function useRouteToMenuFn() {

  const { t } = useTranslation();
  const { themeLayout } = useSettings();
  console.log(themeLayout);
    
  const routeToMenuFn = useCallback(
    (items: AppRouteObject[]) => {
      return items
        .filter((item) => !item.meta?.hideMenu)
        .map((item) => {
          const menuItem: any = [];
          const { meta, children } = item;
          if (meta) {
            const { key, label, icon = 'material-symbols:circle', disabled, suffix } = meta;
            menuItem.key = key;
            menuItem.disabled = disabled;
            // console.log({ item });
            menuItem.label = (
              <div
                className={`inline-flex items-center text-[13px] ${
                  themeLayout === ThemeLayout.Horizontal ? 'justify-start' : 'justify-between'
                } `}
              >
                {/*// @ts-ignore*/}
                {!item?.children ? <a href={'/#' + meta.key}>{t(label)}</a> :
                  <div className="">{t(label)}</div>}
                {suffix}
              </div>
            );
            if (icon) {
              if (typeof icon === 'string') {
                if (icon.startsWith('ic')) {
                  menuItem.icon = <SvgIcon icon={icon} size={24} className="ant-menu-item-icon" />;
                } else {
                  menuItem.icon = themeLayout !== ThemeLayout.Mini ? <Iconify icon={icon} size={icon?.includes('circle') ? 8 : 42} className="ant-menu-item-icon" /> : <></>;
                }
              } else {
                menuItem.icon = icon;
              }
            }
          }
          if (children && children.length) {
            menuItem.children = routeToMenuFn(children);
          } else {
            delete(menuItem.children)
          }
          return menuItem as ItemType;
        });
    },
    [t, themeLayout],
  );
  return routeToMenuFn;
}
