import { ThemeConfig } from 'antd';

import { ThemeColorPresets } from '#/enum';
/**
 * Antd theme editor: https://ant.design/theme-editor-cn
 */
const customThemeTokenConfig: ThemeConfig['token'] = {
  colorSuccess: '#22c55e',
  colorWarning: '#ff7849',
  colorError: '#ff5630',
  colorInfo: '#00b8d9',

  // 线性化
  wireframe: false,

  borderRadiusSM: 2,
  borderRadius: 4,
  borderRadiusLG: 8,
};

const customComponentConfig: ThemeConfig['components'] = {
  Breadcrumb: {
    fontSize: 12,
    separatorMargin: 4,
  },
  Menu: {
    fontSize: 14,
    colorFillAlter: 'transparent',
    itemColor: 'rgb(145, 158, 171)',
    motionDurationMid: '0.125s',
    motionDurationSlow: '0.125s',
  },
  Layout: {
    bodyBg: "#00000000",
    headerBg: "#00000000",
    footerBg: "#00000000",
    headerPadding: 0,
    siderBg: "#00000000"
  },
  Table: {
  },
};

const colorPrimarys: {
  [k in ThemeColorPresets]: string;
} = {
  red: '#E82927',
  blue: '#0074FF',
  green: "#00974E",
  cyan: '#078DEE',
  purple: '#7635DC',
  orange: '#FDA92D',
};

const themeModeToken: Record<'dark' | 'light', ThemeConfig> = {
  dark: {
    token: {
      colorBgLayout: '#000000e0',
      colorBgContainer: '#000',
      colorBgElevated: '#000000e0',
      colorBgBase: '#131313',
      colorPrimaryBg: "#131313",
      colorBorder: "#DBE0E4"
    },
    components: {
      Modal: {
        headerBg: '#212b36',
        contentBg: '#212b36',
        footerBg: '#212b36',
      },
      Tabs: {
        itemColor: '#fff',
      },
      Notification: {},
    },
  },
  light: {
    token: {
      colorBgLayout: '#F9F9F9',
      colorBgContainer: '#fff',
      colorBgElevated: '#F9F9F9',
      colorBgBase: '#131313',
      colorPrimaryBg: "#fff",
      colorBorder: "#DBE0E4"
    },
    components: {
      Modal: {
        headerBg: '#212b36',
        contentBg: '#212b36',
        footerBg: '#212b36',
      },
      Tabs: {
        itemColor: '#fff',
      },
      Notification: {},
    },
  },
};

export { customThemeTokenConfig, customComponentConfig, colorPrimarys, themeModeToken };
