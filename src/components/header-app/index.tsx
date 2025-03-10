// import { useThemeToken } from '@/theme/hooks';
import { Typography } from 'antd';
import { CSSProperties, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  icon: ReactNode;
  rightTop?: ReactNode;
  rightBottom?: ReactNode;
  title: String;
  group: String;
};
export default function HeaderApp({ icon, title, group, children, rightTop, rightBottom }: Props) {

  return (
    <>
      <div
        className='flex gap-4 p-3 items-center shadow-sm mb-2 rounded-xl '
      >
        <div
          className='w-14 h-14 rounded flex justify-center items-center bg-[#2563eb]'
        // style={{backgroundColor: colorPrimary}}
        >
          {icon}
        </div>
        <div
          className='flex gap-3 flex-1 items-center'
        >
          <div
            className='flex gap-1 flex-col'
          >
            <span className='text-xs'>
              {group}
            </span>
            <Typography.Text className='font-bold'>
              {title}
            </Typography.Text>

          </div>
          <div
            className='flex gap-3 flex-1 flex-col items-end'
          >
            {rightTop}
            {rightBottom}
          </div>
        </div>
      </div>
      {children}
    </>

  );
}
