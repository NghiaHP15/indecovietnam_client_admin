import { decodeToken } from 'react-jwt';

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded: any = decodeToken(accessToken);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

export { isValidToken };
