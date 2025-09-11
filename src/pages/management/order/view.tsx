import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Button,
  Col,
  Image,
  Modal,
  Row,
  Space,
  Table,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { MODE } from '#/enum';
import { IOrder } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import _ from 'lodash';
import dayjs from 'dayjs';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { logo_indeco } from '@/assets/images';
import { fCurrencyVN } from '@/utils/format-number';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const DetailViewOrder = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: IOrder; mode: string }>({
    data: undefined,
    mode: MODE.VIEW,
  });

  useImperativeHandle(ref, () => ({
    view: (_data: IOrder) => {
      refMode.current = {
        data: _data,
        mode: MODE.VIEW,
      };
      setIsOpen(true);
    },
  }));

  const afterOpenChange = (_open: boolean) => {
    if (_open) {
      if (refMode.current?.mode == MODE.VIEW) {
        refDetail.current.view(refMode.current?.data);
      }
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    refDetail.current.reset();
  };

  const confirmClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        title={t('common.view')}
        open={isOpen}
        destroyOnClose
        onCancel={closeModal}
        afterOpenChange={afterOpenChange}
        styles={{
          body: { overflowY: 'scroll', flexGrow: 1 },
          content: { backgroundColor: colorBgContainer, display: "flex", flexDirection: "column", justifyContent: "space-between", height: room ? "100vh" : "100%" },
          header: { backgroundColor: colorBgContainer },
          footer: { backgroundColor: colorBgContainer },
        }}
        width={room ? "100vw" : "1000px"}
        centered
        footer={[
          <Space className="pr-3">
            <Button
              onClick={() => setRoom(!room)}
              icon={<ArrowsAltOutlined />}
            >
              {room ? t('common.reduce') : t('common.enlarge')}
            </Button>
            <Button 
              key="close-request" 
              loading={loading} 
              onClick={confirmClose}
            >
              {t('common.close')}
            </Button>
          </Space>
        ]}
      >
          <ViewDetailForm
            ref={refDetail}
            setLoading={setLoading}
            reload={reload}
            closeModal={closeModal}
            readOnly={readOnly}
            isLink={isLink}
          />

      </Modal>
    </>
  );
});

export default DetailViewOrder;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: IOrder = {
  customer: {
    id: '',
  },
  order_date: dayjs().format('YYYY-MM-DD'),
  total_amount: 0,
  paymentmethod: 'bank',
  address: {
    receiver_name: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    address_line: '',
  },
  products: [],
  note: '',
};

export const ViewDetailForm = forwardRef(
  ({ }: FormProps, ref) => {
    const { t } = useTranslation();
  
    const [, setMode] = useState<string>(MODE.CREATE);

    const [param, setParam] = useState<IOrder>(emptyParameter);

    const view = async (data: IOrder) => {
      let _data: IOrder = _.cloneDeep(data);
      setParam(_data);
      setMode(MODE.VIEW);
    };

    useImperativeHandle(ref, () => ({
      view: view,

      reset: resetData,
    }));

    const resetData = () => {
      setParam(emptyParameter);
    };

    return (
      <div id="invoice-section">
        <div className='flex justify-between'>
          <div className='flex flex-col gap-3'>
            <h3 className='text-xl uppercase font-bold'><span style={{color: "#51351e"}}>Indeco</span><span style={{color: "#c59672"}}>Vietnam</span></h3>
            <div className='flex gap-3'>
              <span>{t('management.order.detail.address')}:</span>
              <span>Đoàn Xá - Kiến Thụy - Hải Phòng</span>
            </div>
            <div className='flex gap-3'>
              <span>{t('management.order.detail.phone')}:</span>
              <span>033 1234 567</span>
            </div>
            <div className='flex gap-3'>
              <span>{t('management.order.detail.email')}:</span>
              <span>QK5bD@example.com</span>
            </div>
            <div className='flex gap-3'>
              <span>Website:</span>
              <span>https://indecovietnam.com</span>
            </div>
          </div>
          <div className='flex items-center'>
            <Image
              width={150}
              src={logo_indeco}
              preview={false}
              fallback={logo_indeco}
            />
          </div>
        </div>
        <Row className='mt-6' gutter={30}>
          <Col span={14}>
            <div className='mt-4'>
              <h3 className='text-md font-roboto font-medium'>{t('management.order.view.detail_order')}</h3>
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
                dataSource={param.products}
                pagination={false}
              />
            </div>
            <div className='mt-4'>
              <h3 className='text-md font-roboto font-medium'>{t('management.order.view.information_payment')}</h3>
              <div className='mt-2 flex flex-col gap-2 font-roboto'>
                <div className='flex justify-between'>
                  <span>{t('management.order.detail.total')}:</span>
                  <span>{fCurrencyVN(param.total_amount)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>{t('management.order.detail.total_shipping')}:</span>
                  <span>{fCurrencyVN(0)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-bold'>{t('management.order.detail.total_amount')}:</span>
                  <span>{fCurrencyVN(param.total_amount)}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col span={10}>
            <div className='mt-4'>
              <h3 className='text-md font-roboto font-medium'>{t('management.order.view.information_order')}</h3>
              <div className='mt-2 flex flex-col gap-2 font-roboto'>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.txnref')}:</span>
                  <span>{param.txnRef}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.order_date')}:</span>
                  <span>{dayjs(param.order_date).format('DD/MM/YYYY')}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.paymentmethod')}:</span>
                  <span>{param.paymentmethod}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.phipping_method')}:</span>
                  <span>{'Giao hàng tận nơi'}</span>
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <h3 className='text-md font-roboto font-medium'>{t('management.order.view.information_customer')}</h3>
              <div className='mt-2 flex flex-col gap-2 font-roboto'>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.customer')}:</span>
                  <span>{param.customer?.firstname + ' ' + param.customer?.lastname}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.receiver_name')}:</span>
                  <span>{param.address?.receiver_name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.phone')}</span>
                  <span>{param.address?.phone}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.email')}:</span>
                  <span>{param.customer?.email}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='w-[150px]'>{t('management.order.detail.address')}:</span>
                  <span>{param.address?.address_line + ' - ' + param.address?.ward + ' - ' + param.address?.district + ' - ' + param.address?.city}</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  },
);
