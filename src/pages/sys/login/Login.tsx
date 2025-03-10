import { Layout, message } from 'antd';
import { useSignIn, useUserActions, useUserInfo, useUserToken } from '@/store/userStore';
import LoginForm from './LoginForm';
import { LoginStateProvider } from './providers/LoginStateProvider';
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import bgLoginin from '../../../assets/images/bg-login.jpg';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { Vendor } from '#/entity';
import vendorService from '@/api/services/venderService';
import { LOGIN_TYPE } from '#/enum';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

function Login() {
  const { t } = useTranslation();
  const _token = useUserToken();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const signIn = useSignIn();
  const userInfo = useUserInfo();
  const { setUserInfo } = useUserActions();
  const [vendorId, setVendorId] = useState<string>('');
  const [isLoginAuto, setIsLoginAuto] = useState<boolean>(!!token);
  const domain =
    window.location.hostname == 'localhost'
      ? 'sushicity.warehouse.win.machitech.io'
      : window.location.hostname;

  useEffect(() => {
    loadVendorId();
  }, []);

  useEffect(() => {
    if (token && vendorId) {
      submitAuth();
    }
  }, [token, vendorId]);

  const submitAuth = async () => {
    try {
      if (!token) {
        setIsLoginAuto(false);
        return;
      }
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        message.error(t('sys.expired'));
        setIsLoginAuto(false);
        return;
      }
      await signIn(
        { uid: decoded.uid, type: decoded.type, vendorId: vendorId },
        LOGIN_TYPE.AUTO,
      ).catch(() => {
        setIsLoginAuto(false);
      });
    } catch (error) {
      setIsLoginAuto(false);
    }
  };

  const loadVendorId = async () => {
    try {
      const res: Vendor[] = await vendorService.internalVendors();
      const vendor: any = res.find((item) => item.warehouseDomain === domain);
      if (vendor) {
        setVendorId(vendor.id);
        userInfo.vendorId = vendor.id;
        setUserInfo(userInfo);
      } else {
        message.error(t('sys.no_restaurant'));
      }
    } catch (error) {}
  };

  if (_token) {
    return <Navigate to={HOMEPAGE} replace />;
  }

  if (isLoginAuto) {
    return null;
  }

  return (
    <Layout
      className="relative flex !min-h-screen !w-full !flex-row"
      style={{
        backgroundImage: `url(${bgLoginin})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="m-auto flex !h-screen w-full flex-col items-center justify-center">
        <LoginStateProvider>
          <LoginForm />
        </LoginStateProvider>
      </div>
    </Layout>
  );
}

export default Login;
