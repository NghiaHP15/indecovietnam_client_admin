import { Avatar, Badge, Button, Drawer, Modal, Table, Tabs, TabsProps } from 'antd';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';
import { useThemeToken } from '@/theme/hooks';
// import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { getUnread, markAsRead, notiReadAll } from '@/api/services/notificationService';
import { NOTI_TYPE } from '#/enum';
import { no_avatar } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { IContact, IOrder } from '#/entity';
import { getOrder } from '@/api/services/orderService';
import { getFeedback } from '@/api/services/feedbackService';
import { fCurrencyVN } from '@/utils/format-number';
export default function NoticeButton({reload}: any) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const themeToken = useThemeToken();
  const [, setCount] = useState(4);
  const [data, _setData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    loadNotification();
  }, []);

  useEffect(() => {
    loadNotification();
  }, [reload]);

  const loadNotification = async () => {
    try {
      const res = await getUnread();
      _setData(res);
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
    <>
      <Badge
        offset={[-3, 5]}
        count={data?.filter((x: any) => x.isRead === false)?.length}
        styles={{
          root: { color: 'inherit' },
          indicator: { color: '#fff' },
        }}
      >
        <Button
          className='relative'
          icon={<Iconify icon="solar:bell-bing-bold-duotone" size={24} style={{ color: themeToken.colorTextDescription }} />}
          onClick={() => setDrawerOpen(true)}
        />
      </Badge>
      <Drawer
        placement="right"
        title={t('setting.notification.title')}
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
              await notiReadAll();
              loadNotification();
            }}
          >
            <Iconify icon="solar:check-read-broken" size={20} />
          </IconButton>
        }
      footer={
        <div
          style={{ color: themeToken.colorTextBase }}
          className="flex h-10 w-full items-center justify-center font-semibold font-roboto"
        >
          {t('setting.notification.view_all')}
        </div>
      }
      >
        <NoticeTab data={data} loadNotification={loadNotification} />
      </Drawer>
    </>
  );
}


// @ts-ignore
function NoticeTab(props) {
  const [propsNoti, setPrpsNoti] = useState({});
  const { t } = useTranslation();
  const [data, setData] = useState(props.data || []);
  const [activeKey, setActiveKey] = useState('all');
  const themeToken = useThemeToken();

  useEffect(() => {
    if(activeKey === 'all') {
      setData(props.data);
    } else if(activeKey === 'contact') {
      setData(props.data.filter((x: any) => x.type === NOTI_TYPE.CONTACT));
    } else if(activeKey === 'order') {
      setData(props.data.filter((x: any) => x.type === NOTI_TYPE.ORDER));
    }
  }, [activeKey, props.data]);

  const tabChildren: ReactNode = data.map((item: any) => (
    <div className="text-sm cursor-pointer" onClick={async () => {
      setPrpsNoti((prev) => ({
        ...prev,
        show: true,
        title: `${t('common.view')} ${t('common.notification')}`,
        formValue: item,
        isUpdate: false,
        isView: true,
      }));
      await markAsRead(item.id);
      props?.loadNotification();
    }}>
      <div className={`mt-1 p-2 flex items-center rounded-md ${item.isRead === false ? 'bg-[#edf0f5]' : ''}`}>
        <Avatar
          size={45}
          src={(item.type ===  NOTI_TYPE.CONTACT ? item.contact.avatar : item.order.customer.avatar) || no_avatar}
        />
        <div className="ml-2">
          <div>
            {!item.isRead ? <span className="font-bold">{item.message}</span> :
              <span className="font-light">{item.message}</span>}
          </div>
          <div className='flex flex-col'>
            <span className="text-xs font-light opacity-60">{dayjs(item.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>{' '}
            <span>{item.type ===  NOTI_TYPE.CONTACT ? item.contact.name : item.order.customer.firstname + ' ' + item.order.customer.lastname}</span>
          </div>
        </div>
      </div>
    </div>
  ));
  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: (
        <div className="flex">
          <span style={{ color: themeToken.colorTextBase }}>Tất cả</span>
          <ProTag color="processing">{props?.data.filter((x: any) => !x.isRead)?.length}</ProTag>
        </div>
      ),
      children: tabChildren,
    },
     {
      key: 'order',
      label: (
        <div className="flex">
          <span style={{ color: themeToken.colorTextBase }}>Đơn hàng</span>
          <ProTag color="processing">{props?.data.filter((x: any) => !x.isRead && x.type === NOTI_TYPE.ORDER)?.length}</ProTag>
        </div>
      ),
      children: tabChildren,
    },
    {
      key: 'contact',
      label: (
        <div className="flex">
          <span style={{ color: themeToken.colorTextBase }}>Liên hệ</span>
          <ProTag color="processing">{props?.data.filter((x: any) => !x.isRead && x.type === NOTI_TYPE.CONTACT)?.length}</ProTag>
        </div>
      ),
      children: tabChildren,
    },
  ];
  return (
    <div className="flex flex-col px-6">
      <Tabs defaultActiveKey="1" activeKey={activeKey} items={items} onChange={(key) => setActiveKey(key)} />
      {/*@ts-ignore*/}
      <Detail  {...propsNoti}
        title={t('setting.notification.title_detail')}
        onCancel={() => setPrpsNoti({
          show: false,
          title: '',
          formValue: {},
          isUpdate: false,
          isView: false,
        })} />
    </div>
  );
}


const Detail = (props: any) => {
  const { show, onCancel, formValue } = props;
  const themeToken = useThemeToken();
  const { colorBgContainer } = themeToken;
  const [orderData, setOrderData] = useState<IOrder | null>(null);
  const [contactData, setContactData] = useState<IContact | null>(null);
  const { t } = useTranslation();

  const loadData = async () => {
    try {
      if(formValue?.type === NOTI_TYPE.ORDER) {
        const res = await getOrder(formValue?.order?.id);
        setOrderData(res);
      } else if(formValue?.type === NOTI_TYPE.CONTACT) {
        const res = await getFeedback(formValue?.contact?.id);
        setContactData(res);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if(show) {
      loadData();
    }
  }, [show]);

  return (
    <Modal
      title={props.title}
      onCancel={onCancel}
      open={show}
      width={1000}
      footer={null}
      styles={{
          body: { overflowY: 'scroll', flexGrow: 1 },
          content: { backgroundColor: colorBgContainer, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" },
          header: { backgroundColor: colorBgContainer },
          footer: { backgroundColor: colorBgContainer },
        }}
    >
      <div className='flex justify-between'>
        <div>
          <p><span className='font-medium'>{t('setting.notification.message')}:</span> {formValue?.message}</p>
          <p><span className='font-medium'>{t('setting.notification.time')}:</span> {dayjs(formValue?.created_at).format('DD/MM/YYYY HH:mm:ss')}</p>
          <p><span className='font-medium'>{t('setting.notification.type')}:</span> {formValue?.type === NOTI_TYPE.CONTACT ? 'Liên hệ' : 'Đơn hàng'}</p>
          <p><span className='font-medium'>{t('setting.notification.name')}:</span> {formValue?.type === NOTI_TYPE.CONTACT ? formValue?.contact?.name : formValue?.order?.customer?.firstname + ' ' + formValue?.order?.customer?.lastname}</p>
        </div>
        <Avatar
          shape="square"
          size={100}
          src={(formValue?.type ===  NOTI_TYPE.CONTACT ? formValue?.contact?.avatar : formValue?.order?.customer?.avatar) || no_avatar}
        />
      </div>
      {formValue?.type === NOTI_TYPE.ORDER && orderData && (
        <div className='mt-0'>
          <><p><span className='font-medium'>{t('management.order.detail.txnref')}:</span> {orderData?.txnRef}</p></>
          <><p><span className='font-medium'>{t('management.order.detail.email')}:</span> {orderData?.customer?.email}</p></>
          <><p><span className='font-medium'>{t('management.order.detail.phone')}:</span> {orderData?.address?.phone}</p></>
          <Table
            className='mt-2'
            size={'small'}
            bordered={false}
            columns={[
              {
                title: t('management.order.detail.txnref'),
                dataIndex: 'sku',
                key: 'sku',
                render: (_, record) => <span>{record.product_variant?.sku}</span>,
              },
              {
                title: t('management.order.detail.order_product'),
                dataIndex: 'name',
                key: 'name',
                render: (_, record) => <span>{record.name}</span>,
              },
              {
                title: t('management.order.detail.quantity'),
                dataIndex: 'quantity',
                key: 'quantity',
                render: (_, record) => <span>{record.quantity}</span>,
              },
              {
                title: t('management.order.detail.total_price'),
                dataIndex: 'price',
                key: 'price',
                render: (_, record) => <span>{fCurrencyVN(record.total_price)}</span>,
              },
              ]}
              dataSource={orderData.products}
              pagination={false}
            />
          <div className='mt-4'>
            <div className='mt-2 flex flex-col gap-2 font-roboto'>
              <div className='flex justify-between'>
                <span className='font-bold'>{t('management.order.detail.total_amount')}:</span>
                <span>{fCurrencyVN(orderData.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {formValue?.type === NOTI_TYPE.CONTACT && contactData && (
        <div className='mt-2'>
          <div className='grid grid-cols-3 gap-x-8 gap-y-2'>
            <p className='flex justify-between'><span className='font-medium'>{t('website.feedback.field.email')}:</span><span>{contactData?.email}</span></p>
            <p className='flex justify-between'><span className='font-medium'>{t('website.feedback.field.phone')}:</span> <span>{contactData?.phone}</span></p>
            <p className='flex justify-between'><span className='font-medium'>{t('website.feedback.field.type')}:</span> <span>{contactData?.type}</span></p>
            <p className='flex col-span-3 gap-2'><span className='font-medium'>{t('website.feedback.field.subject')}:</span> <span>{contactData?.subject}</span></p>
            <p className='flex flex-col col-span-3'><span className='font-medium'>{t('website.feedback.field.message')}:</span> <span>{contactData?.message}</span></p>
          </div>
        </div>
      )}
    </Modal>
  );
};
