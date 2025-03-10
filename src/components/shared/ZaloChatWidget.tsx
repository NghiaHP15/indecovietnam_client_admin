import React, { useEffect } from 'react';

interface ZaloChatWidgetProps {
  oaid: string;
  welcomeMessage?: string;
  autopopup?: number;
  width?: number;
  height?: number;
}

const ZaloChatWidget: React.FC<ZaloChatWidgetProps> = ({
  oaid,
  autopopup = 0,
  width = 350,
  height = 450,
}) => {
  useEffect(() => {
    // Load the Zalo SDK script dynamically
    const script = document.createElement('script');
    script.src = 'https://sp.zalo.me/plugins/sdk.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="zalo-chat-widget"
      data-oaid={oaid} // Use the Zalo Official Account ID
      data-autopopup={autopopup.toString()}
      data-width={width}
      data-height={height}
    ></div>
  );
};

export default ZaloChatWidget;
