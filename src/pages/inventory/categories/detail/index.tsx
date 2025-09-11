import Icons from '@/assets/icons';
import Card from '@/components/card';
import { Button, Col, Flex, Form, Input, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';

function CategoriesDetail() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Submitted values:', values);
  };

  return (
    <>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('inventory.categories.name')}
                name="name"
                rules={[
                  { required: true, message: t('common.required') },
                  { min: 3, message: t('common.min_length', { length: 3 }) },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('inventory.categories.description')}
                name="description"
                rules={[{ required: true, message: t('common.required') }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={'Anht'}
                name="description"
                rules={[{ required: true, message: t('common.required') }]}
              >
                <Flex>
                  <div className='border p-2 rounded-lg border-gray-300' >
                    <Icons.ImageEmpty />
                  </div>
                  <div>
                    <Button icon={<Icons.Upload/>}>Tải lên</Button>
                  </div>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Space>
          <Button type="primary" htmlType="submit" onClick={() => form.submit()}>
            {t('common.save')}
          </Button>
          <Button onClick={() => form.resetFields()}>{t('common.reset')}</Button>
        </Space>
      </Card>
    </>
  );
}

export default CategoriesDetail;
