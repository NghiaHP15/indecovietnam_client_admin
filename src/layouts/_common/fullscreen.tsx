import { useThemeToken } from "@/theme/hooks";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import screenfull from 'screenfull';

const Fullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
  const themeToken = useThemeToken();

  const toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
      setIsFullscreen(!isFullscreen);
    }
  };
  
  return (
    <Button 
      icon={isFullscreen ? <FullscreenExitOutlined style={{ color: themeToken.colorTextDescription }} /> : <FullscreenOutlined style={{ color: themeToken.colorTextDescription }} />} 
      onClick={toggleFullScreen}
    />
  );
};

export default Fullscreen;
