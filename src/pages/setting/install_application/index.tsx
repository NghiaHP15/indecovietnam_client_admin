import { useThemeToken } from "@/theme/hooks";
import { AppstoreFilled, ChromeFilled, HomeFilled, MoonFilled, SettingFilled } from "@ant-design/icons";
import { Tabs } from "antd";
import { TabsProps } from "antd/lib";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import General from "./general";
import System from "./system";
import Email from "./email";
// import Pos from "./pos";
import Theme from "./theme";

function AppSetting() {
  const { t } = useTranslation();
  const { colorPrimaryBg, colorTextLightSolid, colorPrimary, colorBorder } = useThemeToken();
  const [activeKey, setActiveKey] = useState<string>('1');

  const styleTab: TabsProps['style'] = {
    fontSize: 24,
    color: colorTextLightSolid,
  }

  const items : TabsProps['items'] = [
    {
      key: '1',
      label: t("setting.install_application.general"),
      icon: <HomeFilled style={styleTab} />,
      children: <General/>
    },
    {
      key: '2',
      label: t("setting.install_application.system"),
      icon: <SettingFilled style={styleTab} />,
      children: <System/>
    },
    {
      key: '3',
      label: t("setting.install_application.email"),
      icon: <ChromeFilled style={styleTab} />,
      children: <Email/>
    },
    {
      key: '4',
      label: t("setting.install_application.pos"),
      icon: <AppstoreFilled style={styleTab} />,
      // children: <Pos/>
    },
    {
      key: '5',
      label: t("setting.install_application.theme"),
      icon: <MoonFilled style={styleTab} />,
      children: <Theme/>
    },
  ]

  const renderTabBar = (props: any, DefaultTabBar: any) => {
    return (
      <div className="w-full p-4 mb-6 border border-solid rounded-lg" style={{background: colorPrimaryBg, borderColor: colorBorder}}>
        <div className="flex items-center gap-2">
          {items.map((item) => (
            <div
              key={item.key}
              className={`flex h-11 px-4 items-center gap-2 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200`}
              onClick={() => setActiveKey(item.key)}
              style={{background: activeKey === item.key ? colorPrimary : "#2B2B2B"}}
            >
              {item.icon}
              <span style={{color: colorTextLightSolid}}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
   <div  className="p-2">
     <Tabs activeKey={activeKey} items={items} renderTabBar={renderTabBar} onChange={(key) => setActiveKey(key)}></Tabs>
   </div>
  );
}

export default AppSetting;
