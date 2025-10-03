import { NavLink } from 'react-router-dom';

import { useThemeToken } from '@/theme/hooks';
import { logo_indeco } from '@/assets/images';
import { Image } from 'antd';

interface Props {
  size?: number | string;
}
function Logo({ size = 50 }: Props) {
  const { colorPrimary } = useThemeToken();

  return (
    <NavLink to="/" className={'flex items-center'}>
      <Image src={logo_indeco} preview={false} style={{ width: size, height: size, color: colorPrimary }} />
    </NavLink>
  );
}

export default Logo;
