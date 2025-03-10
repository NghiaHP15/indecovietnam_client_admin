import { SvgIcon } from "@/components/icon";
import Divider from "@/pages/components/divider";
import { useThemeToken } from "@/theme/hooks";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useTranslation } from "react-i18next";

function Email() {
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
              <Divider label={t('setting.email.email_setting')} />
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.email.method")} name="method" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.email.host")} name="host" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.email.server")} name="server" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.email.port")} name="port" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.email.name")} name="name" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.email.password")} name="password" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
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

export default Email;