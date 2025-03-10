import { Button, Dropdown, Space } from 'antd';

import useLocale, { LANGUAGE_MAP } from '@/locales/useLocale';

import { SvgIcon } from '../icon';

import { LocalEnum } from '#/enum';
import type { MenuProps } from 'antd';
import { useThemeToken } from '@/theme/hooks';
import Color from 'color';

type Locale = keyof typeof LocalEnum;

/**
 * Locale Picker
 */
interface PropKey {
  title?: string,
}

export default function LocalePicker({title}: PropKey) {
  const { setLocale } = useLocale();
  const { colorBorder, colorTextBase } = useThemeToken();

  const localeList: MenuProps['items'] = Object.values(LANGUAGE_MAP).map((item) => {
    return {
      key: item.locale,
      label: item.label,
      icon: <SvgIcon icon={item.icon} size="20" className="rounded-md" />,
    };
  });

  return (
    <>
      <Dropdown
        placement="bottomRight"
        arrow
        trigger={['click']}
        menu={{ items: localeList, onClick: (e) => setLocale(e.key as Locale) }}
      >
        <Space>
          <Button type="primary" className="!p-1.5" style={{ backgroundColor: Color(colorBorder).alpha(0.6).toString(), borderRadius: "15px"}}>
            <SvgIcon icon="ic-would" size={20} />
            {title && <span className='text-xs' style={{color: colorTextBase}}>{title}</span>}
          </Button>
        </Space>
      </Dropdown>
    </>
  );
}
