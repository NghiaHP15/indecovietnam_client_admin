import { Dropdown, Space } from "antd";
import { MenuProps } from "antd/lib";
import { SvgIcon } from "@/components/icon";
import { useTranslation } from "react-i18next";

export default function Language () {
 const { t } = useTranslation();

 const items: MenuProps['items'] = [
    {
      key: '1',
      label: t("common.language.vi"),
      icon: <SvgIcon icon="ic-vietnam" size={24}/>
    },
    {
      key: '2',
      label: t("common.language.en"),
      icon: <SvgIcon icon="ic-english" size={24}/>
    },
    {
      key: '3',
      label: t("common.language.norsk"),
      icon: <SvgIcon icon="ic-norway" size={24}/>
    },
  ];

  return(
  <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight" arrow>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        <span className="text-text-sm font-medium text-gray">{t(`common.language.name`)}</span>
        <SvgIcon icon="ic-translation" size={28} />
      </Space>
    </a>
  </Dropdown>
  )
}