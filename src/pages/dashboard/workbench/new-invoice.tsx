import { Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Card from '@/components/card';
import Scrollbar from '@/components/scrollbar';
import ProTag from '@/theme/antd/components/tag';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { fCurrencyVN } from '@/utils/format-number';

interface DataType {
  id: string;
  txnRef: string;
  total_amount: string;
  customer_name: string;
  status: string;
  payment_status: string;
}

export default function NewInvoice({ data }: { data: DataType[] }) {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<ColumnsType<DataType>>([]);

  useEffect(()=> {
    setColumns([
      {
      title: t('management.order.field.txnref'),
      dataIndex: 'txnref',
      key: 'txnref',
      render: (_, record) => <span>{record.txnRef}</span>,
      },
      {
        title: t('management.order.field.customer'),
        dataIndex: 'customer_name',
        key: 'customer_name',
        render: (_, record) => <span>{record.customer_name}</span>,
      },
      {
        title: t('management.order.field.total_amount'),
        dataIndex: 'total_amount',
        key: 'total_amount',
        render: (_, record) => <span>{fCurrencyVN(record.total_amount)}</span>,
      },
      {
        title: t('management.order.field.status'),
        key: 'status',
        dataIndex: 'status',
        render: (_, record) => {
          const status = record.status as string;
          let color = 'success';
          if (status === 'pending') color = 'blue';
          if (status === 'processing') color = 'yellow';
          if (status === 'shipped') color = 'orange';
          if (status === 'delivered') color = 'success';
          if (status === 'cancelled') color = 'red';
          return <ProTag color={color}>{status}</ProTag>;
        },
      },
    ])
  },[t])

  return (
    <Card className="flex-col">
      <header className="self-start">
        <Typography.Title level={5}>{t('dashboard.new_order')}</Typography.Title>
      </header>
      <main className="w-full">
        <Scrollbar>
          <Table columns={columns} dataSource={data} pagination={false} />
        </Scrollbar>
      </main>
    </Card>
  );
}
