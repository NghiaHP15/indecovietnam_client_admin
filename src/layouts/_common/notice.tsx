import { Badge, Drawer, Tabs, TabsProps } from 'antd';
// import Color from 'color';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';

// import CyanBlur from '@/assets/images/background/cyan-blur.png';
// import RedBlur from '@/assets/images/background/red-blur.png';
import { IconButton, Iconify, SvgIcon } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';
import { useThemeToken } from '@/theme/hooks';
// import { useTranslation } from 'react-i18next';
// import notificationHistoryService from '@/api/services/notificationHistoryService.ts';
import dayjs from 'dayjs';
export default function NoticeButton({reload}: any) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const themeToken = useThemeToken();
  const [, setCount] = useState(4);
  const [data, _setData] = useState([]);
  // const [data] = useState([]);

  useEffect(() => {
    loadNotification();
  }, []);

  useEffect(() => {
    loadNotification();
  }, [reload]);

  const loadNotification = () => {
    try {
      // notificationHistoryService.searchAll().then((res: any) => {
      //   setData(res)
      // })
    } catch (error) {
      console.error(error);
    }
  };
  const style: CSSProperties = {
    backdropFilter: 'blur(20px)',
    // backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
    backgroundRepeat: 'no-repeat, no-repeat',
    // backgroundColor: Color(themeToken.colorBgContainer).alpha(0.9).toString(),
    backgroundPosition: 'right top, left bottom',
    backgroundSize: '50, 50%',
  };

  return (
    <div>
      <IconButton onClick={() => setDrawerOpen(true)}>
        <Badge
          count={data?.filter((x: any) => x.status === "UNSEEN")?.length}
          styles={{
            root: { color: 'inherit' },
            indicator: { color: '#fff' },
          }}
        >
          <Iconify icon="solar:bell-bing-bold-duotone" size={24} />
        </Badge>
      </IconButton>
      <Drawer
        placement="right"
        title="Notifications"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        closable={true}
        width={420}
        styles={{
          body: { padding: 0 },
          mask: { backgroundColor: 'transparent' },
        }}
        style={style}
        extra={
          <IconButton
            style={{ color: themeToken.colorPrimary }}
            onClick={async () => {
              setCount(0);
              setDrawerOpen(false);
              // await notificationHistoryService.seenAll();
              loadNotification();
            }}
          >
            <Iconify icon="solar:check-read-broken" size={20} />
          </IconButton>
        }
      // footer={
      //   <div
      //     style={{ color: themeToken.colorTextBase }}
      //     className="flex h-10 w-full items-center justify-center font-semibold"
      //   >
      //     View All
      //   </div>
      // }
      >
        <NoticeTab data={data} loadNotification={loadNotification} />
      </Drawer>
    </div>
  );
}


// @ts-ignore
function NoticeTab(props) {
  // const [propsNoti, setPrpsNoti] = useState({});
  // const { t } = useTranslation();

  const tabChildren: ReactNode = props.data.map((item: any) => (
    <div className="text-sm cursor-pointer" onClick={async () => {
      // setPrpsNoti((prev) => ({
      //   ...prev,
      //   show: true,
      //   title: `${t('common.view')} ${t('common.notification')}`,
      //   formValue: item,
      //   isUpdate: false,
      //   isView: true,
      // }));
      // await notificationHistoryService.seen(item.id);
      props?.loadNotification();
    }}>
      <div className={`mt-2 pt-2 pb-2 flex ${item.status === "UNSEEN" ? 'bg-[#e2e8f0]' : ''}`}>
        <IconButton>
          <SvgIcon icon="ic_mail" size={30} />
        </IconButton>
        <div className="ml-2">
          <div>
            {!item.seen ? <span className="font-bold">{item.content}</span> :
              <span className="font-light">{item.content}</span>}
          </div>
          <span
            className="text-xs font-light opacity-60">{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>{' '}
        </div>
      </div>
    </div>
  ));
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex">
          <span>Tất cả</span>
          <ProTag color="processing">{props?.data?.filter((x: any) => !x.seen)?.length}</ProTag>
        </div>
      ),
      children: tabChildren,
    },

  ];
  return (
    <div className="flex flex-col px-6">
      <Tabs defaultActiveKey="1" items={items} />
      {/*@ts-ignore*/}
      {/* <Detail  {...propsNoti}
        title="Xem chi tiết thông báo"
        onCancel={() => setPrpsNoti({
          show: false,
          title: '',
          formValue: {},
          isUpdate: false,
          isView: false,
        })} /> */}
    </div>
  );
}
