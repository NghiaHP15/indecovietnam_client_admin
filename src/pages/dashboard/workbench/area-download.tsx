import { Typography } from 'antd';
import { useEffect, useState } from 'react';

import Card from '@/components/card';
import Chart from '@/components/chart/chart';
import useChart from '@/components/chart/useChart';
import { useTranslation } from 'react-i18next';


export default function AreaDownload({ data }: { data: any }) {
  const { t } = useTranslation();

  const date = {
    dateNow: (new Date().getFullYear()).toString(),
    datePrev: (new Date().getFullYear() - 1).toString(), 
  };
  
  const seriesEmpty: Record<string, ApexAxisChartSeries> = {
    [date.dateNow]: [
      { name: t('dashboard.purchases'), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: t('dashboard.purchases_returns'), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  
    [date.datePrev]: [
      { name: t('dashboard.purchases'), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: t('dashboard.purchases_returns'), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  };

  const [year, ] = useState(date.dateNow);
  const [revenue, setRevenue] = useState<any>(seriesEmpty);

  useEffect(() => {
    setRevenue(data);
  }, [data]);

  // const optionYears = Object.keys(data).map(year => ({ year: year }))
  
  return (
    <Card className="flex-col !rounded-md !p-3">
      <header className="flex w-full justify-between items-center">
        <Typography.Title level={5}>{t('dashboard.sales')}</Typography.Title>
        {/* <Button shape='circle' type='text' icon={<Icons.ICReset style={{ fill: colorTextBase }} />} /> */}
      </header>
      <main className="w-full">
        {<ChartArea series={revenue[year] || seriesEmpty[year]} />}
      </main>
    </Card>
  );
}

function ChartArea({ series }: { series: ApexAxisChartSeries }) {
  
  const chartOptions = useChart({
    xaxis: {
      type: 'category',
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jut',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    tooltip: {},
  });

  return <Chart type="area" series={series} options={chartOptions} height={300} />;
}
