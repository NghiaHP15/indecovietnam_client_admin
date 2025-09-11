import { useThemeToken } from '@/theme/hooks';
import React from 'react';

interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function Card({ className, style, children }: CardProps) {
  const { colorBgContainer } = useThemeToken();

  return (
    <div
      className={`p-5  ${className}`}
      style={{
        backgroundColor: colorBgContainer,
        border: '1px solid #DBE0E4',
        borderRadius: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
