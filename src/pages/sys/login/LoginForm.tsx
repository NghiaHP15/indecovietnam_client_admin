import { Button, Col, Flex, Form, Input, Row, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginUserInput } from '@/api/services/userService';
import { useSignIn, useUserInfo } from '@/store/userStore';
import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';
import urlBackground from "../../../assets/images/bg.jpg"
import logo from "../../../assets/images/logo.png"
// import { useQuery } from '@tanstack/react-query';
// import vendorService from '@/api/services/venderService';
import _ from 'lodash';
import { LOGIN_TYPE } from '#/enum';
import { useThemeToken } from '@/theme/hooks';
import LocalePicker from '@/components/locale-picker';
import AddonBefore from '@/pages/components/addonBefore';

function LoginForm() {

  const { t } = useTranslation();
  const userInfo = useUserInfo();
  const { colorTextLightSolid, colorBgContainer, colorTextBase } = useThemeToken();
  // const [login, setLogin] = useState<LoginRequest>({ userName: "", password: "", vendorId: "" });
  const [loading, setLoading] = useState(false);
  // type PropKey = keyof LoginRequest;

  const { loginState } = useLoginStateContext();
  const signIn = useSignIn();

  if (loginState !== LoginStateEnum.LOGIN) return null;

  // const { data } = useQuery({
  //   queryKey: ["Vendor"],
  //   queryFn: () => vendorService.internalVendors(),
  //   staleTime: 300000,
  //   retry: 1,
  // })

  const handleFinish = async (data: LoginUserInput) => {
    try {
      setLoading(true)
      await signIn({ ...data, vendorId: userInfo.vendorId }, LOGIN_TYPE.LOGIN);
    } finally {
      setLoading(false)
    }
  };

  // const onChange = (value: any, field: PropKey) => {
  //   const _login: LoginRequest = _.cloneDeep(login)
  //   _login[field] = value
  //   setLogin(_login);
  // }

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
              username: '',
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
              name="userName"
              rules={[{ required: true, message: t('sys.login.usernamePlaceholder') }]}
            >
              <Input addonBefore={<AddonBefore label={t('sys.login.username')} required={true} width={150} />}  placeholder={t('sys.login.enter')} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
            >
              <Input.Password addonBefore={<AddonBefore label={t('sys.login.password')} required={true} width={150} />} type="password" placeholder={t('sys.login.enter')} />
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
            className='w-full h-full rounded-r-lg'
            style={{
              backgroundImage: `url(${urlBackground})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className='h-full w-full flex flex-col items-center justify-center rounded-r-lg' style={{background: "#00000099"}}>
              <img src={logo} className='w-80 mb-2 mx-12' />
              <span style={{color: colorTextLightSolid}}>© 2025 Machi</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>

  );
}

export default LoginForm;
