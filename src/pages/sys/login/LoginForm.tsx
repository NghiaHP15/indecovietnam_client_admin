import { Button, Col, Flex, Form, Input, Row, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSignIn } from '@/store/userStore';
import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';
import urlBackground from "../../../assets/images/bg.jpg"
import logo from "../../../assets/images/logo.png"
import _ from 'lodash';
import { useThemeToken } from '@/theme/hooks';
import LocalePicker from '@/components/locale-picker';
import { LoginUser } from '@/api/services/authAccount.service';

function LoginForm() {

  const { t } = useTranslation();
  const { colorTextLightSolid, colorBgContainer, colorTextBase } = useThemeToken();
  const [loading, setLoading] = useState(false);

  const { loginState } = useLoginStateContext();
  const signIn = useSignIn();

  if (loginState !== LoginStateEnum.LOGIN) return null;

  const handleFinish = async (data: LoginUser) => {
    try {
      setLoading(true)
      await signIn({ ...data });
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className='justify-center drop-shadow-lg'>
      <Row>
        <Col span={12}>
          <div 
            className='my-8 py-12 px-8 rounded-l-lg' 
            style={{
              backgroundColor: colorBgContainer, 
            }}
          >
          <Form
            name="login"
            layout="vertical"
            initialValues={{
              remember: true,
              email: '',
              password: '',
            }}
            onFinish={handleFinish}
          >
            <Flex className='justify-end'>
              <LocalePicker title='Chọn ngôn ngữ' />
            </Flex>
            <Flex vertical={true} className='mb-4'>
              <Typography.Title level={4}>{t("sys.login.title")}</Typography.Title>
              <Typography.Text color={colorTextBase} style={{fontSize: "12px"}}>{t("sys.login.description")}</Typography.Text>
            </Flex>
            <Form.Item
              name="email"
              rules={[{ required: true, message: t('sys.login.usernamePlaceholder') }]}
            >
              <Input placeholder={t('sys.login.usernamePlaceholder')} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
            >
              <Input.Password type="password" placeholder={t('sys.login.passwordPlaceholder')} />
            </Form.Item>
            <Form.Item>
              <Flex justify='space-between' align='center'>
                <span 
                  className='cursor-pointer text-xs font-medium' 
                  style={{color: colorTextBase}}
                >
                  {t("sys.login.forgot_password")}
                </span>
                <Button type="primary" htmlType="submit" loading={loading} className='w-40'>
                  {t('sys.login.loginButton')}
                </Button>
              </Flex>
            </Form.Item>

          </Form>
          </div>
        </Col>
        <Col span={12}>
          <div 
            className='w-full h-full rounded-r-lg font-roboto'
            style={{
              backgroundImage: `url(${urlBackground})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className='h-full w-full flex flex-col items-center justify-center rounded-r-lg' style={{background: "#00000066"}}>
              <img src={logo} className='w-80 mb-2 mx-12' />
              <span style={{color: colorTextLightSolid}}>© 2025 Indeco VietNam</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>

  );
}

export default LoginForm;
