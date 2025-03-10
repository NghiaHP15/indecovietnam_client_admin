import { SvgIcon } from "@/components/icon";
import Divider from "@/pages/components/divider";
import { useThemeToken } from "@/theme/hooks";
import { Button, Col, Form, Row, Select } from "antd";
import { useTranslation } from "react-i18next";

function System() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { colorPrimaryBg, colorTextLightSolid, colorPrimary, colorBorder } = useThemeToken();

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('Form Values:', values);
    }).catch(info => {
      console.log('Validation Failed:', info);
    });
  };

  
  return (
    <>
      <div className="p-4 mb-6 border border-solid rounded-lg" style={{background: colorPrimaryBg, borderColor: colorBorder}}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Divider label={t('setting.system.system_setting')} />
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.system.language")} name="language" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.system.timezone")} name="timezone" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.system.currency")} name="currency" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
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

export default System;