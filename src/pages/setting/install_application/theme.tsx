import { ThemeColorPresets } from "#/enum";
import { SvgIcon } from "@/components/icon";
import Divider from "@/pages/components/divider";
import { useSettingActions, useSettings } from "@/store/settingStore";
import { colorPrimarys } from "@/theme/antd/theme";
import { useThemeToken } from "@/theme/hooks";
import { Avatar, Button, Col, Form, Row, Space } from "antd";
import { useTranslation } from "react-i18next";

function Theme() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { colorPrimaryBg, colorTextLightSolid, colorPrimary, colorBorder } = useThemeToken();
  const settings = useSettings();
  const { themeColorPresets } = settings;
  const { setSettings } = useSettingActions();

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('Form Values:', values);
    }).catch(info => {
      console.log('Validation Failed:', info);
    });
  };

  console.log(themeColorPresets);

  const onchangeColor = (themeColorPresets: ThemeColorPresets) => {
    setSettings({...settings, themeColorPresets});
  }
  
  return (
    <>
      <div className="p-4 mb-6 border border-solid rounded-lg" style={{background: colorPrimaryBg, borderColor: colorBorder}}>
        <Row gutter={16}>
          <Col span={24}>
            <Divider label={t('setting.theme.color')} />
          </Col>
          <Col span={24}>
            <Space size={24}>
              {Object.entries(colorPrimarys).map(([key, value]) =>
              <div className="rounded-md border-2 border-dotted" style={{ borderColor: themeColorPresets === key ? colorBorder : "transparent", padding: 4}}>
                <Avatar className="cursor-pointer" onClick={() => onchangeColor(key as ThemeColorPresets)} shape="square" size={64} style={{background: value}} icon={themeColorPresets === key ? <SvgIcon icon="ic-group" size={20} /> : null} />
              </div> 
              )}
            </Space>
          </Col>
        </Row>
      </div>
      <div className="p-4 border border-solid rounded-lg" style={{background: colorPrimaryBg, borderColor: colorBorder}}>
        <Button type="primary" size="large" className="hover:opacity-80" onClick={handleSave} style={{background: colorPrimary, color: colorTextLightSolid}}>
          <div className="px-2 flex items-center">
            <SvgIcon icon="ic-save" size={20} />
            <span className="ml-2">{t('common.save')}</span>
          </div>
        </Button>
      </div>
    </>
  );
}

export default Theme;