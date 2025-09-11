import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import _ from 'lodash';
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
import { GENDER_OPTIONS, LEVEL_CUSTOMER, MODE, ORDER_STATUS, PAYMENT_STATUS, PROVIDER_CUSTOMER } from '#/enum';
import { ICustomer, IOrder } from '#/entity';
import { useThemeToken } from '@/theme/hooks';
import { ArrowsAltOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { no_image } from '@/assets/images';
import { ColumnsType } from 'antd/es/table';

type Props = {
  reload: () => void;
  readOnly?: boolean;
  isLink?: boolean;
};

const CustomerViewDetail = forwardRef(({ reload, readOnly, isLink }: Props, ref) => {
  const { t } = useTranslation();

  const refDetail = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<boolean>(false);

  const { colorBgContainer } = useThemeToken();

  const refMode = useRef<{ data?: ICustomer; mode: string }>({
    data: undefined,
    mode: MODE.VIEW,
  });

  useImperativeHandle(ref, () => ({
    view: (_data: ICustomer) => {
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
        <CustomerViewDetailForm
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

export default CustomerViewDetail;

type FormProps = {
  reload: () => void;
  readOnly?: boolean;
  setLoading: (i: boolean) => void;
  closeModal: () => void;
  isLink?: boolean;
};

const emptyParameter: ICustomer = {
  id: '',
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  date_of_birth: dayjs().format('YYYY-MM-DD'),
  gender: GENDER_OPTIONS.OTHER,
  level: LEVEL_CUSTOMER.SLIVER,
  avatar: '',
  provider: PROVIDER_CUSTOMER.LOCAL,
  password: '123456',
  addresses: [],
};

export const CustomerViewDetailForm = forwardRef(
  ({  }: FormProps, ref) => {
    const { t } = useTranslation();

    const [param, setParam] = useState<ICustomer>(emptyParameter);

    const [colunmOrder, setColumnOrder] = useState<ColumnsType<IOrder>>([]);

    const [columnAddress, setColumnAddress] = useState<ColumnsType<any>>([]);

    useEffect(() => {
      setColumnAddress([
        {
          key: 'index',
          title: '#',
          render: (_, __, index) => <span>{index + 1}</span>,
          width: 50,
        },
        {
          key: 'receiver_name',
          title: t('website.address.field.receiver_name'),
          dataIndex: 'receiver_name',
          width: 150,
          render: (_, record) => <span className="line-clamp-2">{record.receiver_name}</span>
        },
        {
          key: 'phone',
          title: t('website.address.field.phone'),
          dataIndex: 'phone',
          width: 150,
          render: (_, record) => <span className="line-clamp-2">{record.phone}</span>
        },
        {
          key: 'address_line',
          dataIndex: 'address_line',
          title: t('website.address.field.address_line'),
          width: 450,
          render: (_, record) => <span className="line-clamp-2">{record.address_line + ' - ' + record.ward + ' - ' + record.district + ' - ' + record.city}</span>
        },
      ])
      setColumnOrder([
        {
          key: 'index',
          title: '#',
          render: (_, __, index) => <span>{index + 1}</span>,
          width: 50,
        },
        {
          key: 'txnRef',
          title: t('management.order.field.txnref'),
          dataIndex: 'txnRef',
          width: 150,
          render: (_, record) => <span className="line-clamp-2">{record.txnRef}</span>
        },
        {
          key: 'order_date',
          title: t('management.order.field.order_date'),
          dataIndex: 'order_date',
          width: 100,
          render: (_, record) => <span className="line-clamp-2">{dayjs(record.order_date).format('DD/MM/YYYY')}</span>
        },
        {
          key: 'total_amount',
          title: t('management.order.field.total_amount'),
          dataIndex: 'total_amount',
          width: 100,
          render: (_, record) => <span className="line-clamp-2">{record.total_amount}</span>
        },
        {
          key: 'paymentmethod',
          title: t('management.order.field.paymentmethod'),
          dataIndex: 'paymentmethod',
          width: 120,
          render: (_, record) => <span className="line-clamp-2">{record.paymentmethod}</span>
        },
        {
          key: 'payment_status',
          title: t('management.order.field.payment_status'),
          dataIndex: 'payment_status',
          width: 150,
          render: (_, record) =>  {
            console.log(record);
            
            let value;
            let style;
            switch(record.payment_status) {
              case PAYMENT_STATUS.PENDING:
                value = t('management.order.payment_status.pending');
                style = "text-yellow";
                break;
              case PAYMENT_STATUS.PAID:
                value = t('management.order.payment_status.paid');
                value = "text-success";
                break;
              case PAYMENT_STATUS.AWAITINGCOFIRMATION:
                value = t('management.order.payment_status.awaiting_confirmation');
                style = "text-blue";
                break;
              case PAYMENT_STATUS.CANCELLED:
                value = t('management.order.payment_status.cancel');
                value = "text-error";
                break;
              case PAYMENT_STATUS.FAILED:
                value = t('management.order.payment_status.failed');
                value = "text-error";
                break;
              default:
                value = record.payment_status;
                break;
            }

            return <span className={`line-clamp-2 ${style}`}>{value}</span>
          }
        },
        {
          key: 'status',
          title: t('management.order.field.status'),
          dataIndex: 'status',
          width: 150,
          render: (_, record) => {

            let value;
            let style;
            switch(record.status) {
              case ORDER_STATUS.PENDING:
                value = t('management.order.order_status.pending');
                style = "text-yellow";
                break;
              case ORDER_STATUS.PROCESSING:
                value = t('management.order.order_status.processing');
                style = "text-blue";
                break;
              case ORDER_STATUS.SHIPPED:
                value = t('management.order.order_status.shipped');
                style = "text-blue";
                break;
              case ORDER_STATUS.DELIVERED:
                value = t('management.order.order_status.delivered');
                value = "text-success";
                break;
              case ORDER_STATUS.CANCELLED:
                value = t('management.order.order_status.cancelled');
                value = "text-error";
                break;
              default:
                value = record.payment_status;
                break;
            }

            return <span className={`line-clamp-2 ${style}`}>{value}</span>
          }
        },
      ])
    }, [t]);
  
    const view = async (data: ICustomer) => {
      let _data: ICustomer = _.cloneDeep(data);
      setParam(_data);
    };

    useImperativeHandle(ref, () => ({
      view: view,

      reset: resetData,
    }));

    const resetData = () => {
      setParam(emptyParameter);
    }

    return (
      <Row gutter={30}>
        <Col span={8}>
          <div className='flex flex-col gap-2'>
            <div className='flex w-full items-center justify-between font-roboto'>
              <span className='font-medium w-[100px]'>{t('management.customer.field.firstname')}: </span>
              <span>{param.firstname}</span>
            </div>
            <div className='flex w-full items-center justify-between font-roboto'>
              <span className='font-medium w-[100px]'>{t('management.customer.field.lastname')}: </span>
              <span>{param.lastname}</span>
            </div>
            <div className='flex w-full items-center justify-between font-roboto'>
              <span className='font-medium w-[100px]'>{t('management.customer.field.email')}: </span>
              <span>{param.email}</span>
            </div>
            <div className='flex w-full items-center justify-between font-roboto'>
              <span className='font-medium w-[100px]'>{t('management.customer.field.phone')}: </span>
              <span>{param.phone}</span>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='flex flex-col gap-2'>
            <div className='flex w-full items-center justify-between font-roboto'>
              <span className='font-medium w-[100px]'>{t('management.customer.field.gender')}: </span>
              <span>{param.gender === GENDER_OPTIONS.MALE ? 'Nam' : 'Nữ'}</span>
            </div>
            <div className='flex w-full items-center justify-between font-roboto'>
              <span className='font-medium w-[100px]'>{t('management.customer.field.date_of_birth')}: </span>
              <span>{dayjs(param.date_of_birth).format('DD/MM/YYYY')}</span>
            </div>
            <div className='flex w-full items-center justify-between font-roboto'>
              <span className='font-medium w-[100px]'>{t('management.customer.field.level')}: </span>
              <span>{param.level}</span>
            </div>
            <div className='flex w-full items-center justify-between font-roboto'>
              <span className='font-medium w-[100px]'>{t('management.customer.field.provider')}: </span>
              <span>{param.provider}</span>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='flex gap-4 w-full font-roboto'>
            <span className='font-medium'>{t('management.customer.field.avatar')}:</span>
            <Image 
              src={param.avatar || no_image} 
              width={130}  
              className="overflow-hidden rounded-md"
            />
          </div>
        </Col>
        {param.orders?.length && param.orders?.length > 0 ?
          <Col span={24}>
            <div className='flex flex-col gap-4 mt-6 font-roboto'>
              <span className='font-medium '>{t('management.customer.list_order')}:</span>
              <Table
                rowKey='id'
                columns={colunmOrder}
                pagination={false}
                dataSource={param.orders}
                size='small'
              />
            </div>
          </Col>
          : null
        }
        {param.addresses?.length && param.addresses?.length > 0 ?
        <Col span={24}>
          <div className='flex flex-col gap-4 mt-6 font-roboto'>
            <span className='font-medium '>{t('management.customer.list_address')}:</span>
            <Table
              rowKey='id'
              columns={columnAddress}
              dataSource={param.addresses}
              size='small'
              pagination={false}
            />
          </div>
        </Col>
        : null
        }
      </Row>
    );
  },
);
