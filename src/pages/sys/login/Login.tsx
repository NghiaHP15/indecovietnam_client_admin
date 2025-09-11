import { Layout, message } from 'antd';
import { useSignIn, useUserToken } from '@/store/userStore';
import LoginForm from './LoginForm';
import { LoginStateProvider } from './providers/LoginStateProvider';
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import bgLoginin from '../../../assets/images/bg-login.jpg';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

function Login() {
  const { t } = useTranslation();
  const _token = useUserToken();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const signIn = useSignIn();
  const [isLoginAuto, setIsLoginAuto] = useState<boolean>(!!token);

  useEffect(() => {
    if (token) {
      submitAuth();
    }
  }, [token]);

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
      await signIn({ }).catch(() => {
        setIsLoginAuto(false);
      });
    } catch (error) {
      setIsLoginAuto(false);
    }
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
