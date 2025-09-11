import { ThemeMode } from "#/enum";
import { useSettingActions, useSettings } from "@/store/settingStore";
import { Avatar, Button } from "antd";
import { useState } from "react";
import sun from "@/assets/images/icon/sun.png";
import moon from "@/assets/images/icon/moon.png";

const LightDark = () => {
  const settings = useSettings();
  const [theme, setTheme] = useState(true ? settings.themeMode : ThemeMode.Light);
  const { setSettings } = useSettingActions();

  const toggleTheme = () => {
    const newTheme = theme === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
    setTheme(newTheme);
    setSettings({ ...settings, themeMode: newTheme });
    // setTheme(themeMode);
    // setSettings({
    //   ...settings,
    //   themeMode,
    // });
  };
  
  return (
    <>
      <Button 
        onClick={toggleTheme}
        icon={<Avatar size={28} src={theme === ThemeMode.Light ? sun : moon}  />}
      />
    </>
  );
};

export default LightDark;
