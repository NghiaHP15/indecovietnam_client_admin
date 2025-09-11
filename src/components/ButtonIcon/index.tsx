import Icons from '@/assets/icons';
import React from 'react';
import { Link } from 'react-router-dom';
type IconProps = React.HTMLAttributes<SVGElement>;
interface ButtonIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  typeIcon: 'view' | 'edit' | 'delete';
  className?: string;
  styleIcon?: IconProps;
  href?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  onClick,
  typeIcon,
  className,
  styleIcon,
  style,
  href,
  ...props
}) => {
  const bgButton = typeIcon == 'delete' ? '#ff00001a' : '#0074FF1A';

  let icon;
  switch (typeIcon) {
    case 'edit':
      icon = <Icons.Paint {...styleIcon} />;
      break;
    case 'delete':
      icon = <Icons.Trash {...styleIcon}/>;
      break;
    default:
      icon = <Icons.Eye {...styleIcon} />;
      break;
  }

  return href ? (
    <Link
      to={href}
      style={{ backgroundColor: bgButton, borderRadius: '4px', ...style }}
      className={`flex h-[24px] min-w-[24px] items-center justify-center gap-2 ${className}`}
    >
      <span>{icon}</span>
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: bgButton, ...style }}
      className={`flex h-[24px] min-w-[24px] items-center justify-center gap-2 rounded-[4px] ${className}`}
      {...props}
    >
      <span>{icon}</span>
    </button>
  );
};

export default ButtonIcon;
