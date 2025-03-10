import { SvgIcon } from "@/components/icon";
import { UploadLogo } from "@/components/upload/upload-logo";
import Divider from "@/pages/components/divider";
import { useThemeToken } from "@/theme/hooks";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useTranslation } from "react-i18next";

function General() {
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
              <Divider label={t('setting.install_application.general_setting')} />
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.name_app")} name="name" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.customer_default")} name="customerDefault" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.account_sell")} name="sellAccount" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.account_buy")} name="buyAccount" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Nhập..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.account_wage")} name="wageAccount" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.copyright")} name="copyright" rules={[{ required: true, message: t('common.error_required') }]}>
                <Select placeholder="Chọn..."></Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Divider label={t('setting.install_application.product')} />
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.name_app")} name="nameApp" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.tax_number")} name="taxNumber" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.phone")} name="phone" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label={t("setting.install_application.address")} name="address" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.city")} name="city" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.status")} name="status" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.code")} name="code" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.country")} name="country" rules={[{ required: true, message: t('common.error_required') }]}>
                <Input placeholder="Chọn..."></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.logo")} name="logo">
                <UploadLogo/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("setting.install_application.logo_app")} name="appIcon">
                <UploadLogo/>
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

export default General;