import { Select, Typography } from 'antd';
import { useEffect, useState } from 'react';

import Card from '@/components/card';
import Chart from '@/components/chart/chart';
import useChart from '@/components/chart/useChart';
import receiptService from '@/api/services/receiptService';
import { useTranslation } from 'react-i18next';


export default function AreaDownload() {

  const { t } = useTranslation();

  const date = {
    dateNow: new Date().getFullYear(),
    datePrev: new Date().getFullYear() - 1, 
  };
  
  const seriesEmpty: Record<string, ApexAxisChartSeries> = {
    [date.dateNow]: [
      { name: t('dashboard.in_price'), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: t('dashboard.out_price'), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  
    [date.datePrev]: [
      { name: t('dashboard.in_price'), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: t('dashboard.out_price'), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  };

  const [year, setYear] = useState(date.dateNow);
  const [data, setData] = useState<any>(seriesEmpty);
  
  useEffect(()=> {
    const fetchDataReceipt = async () => {
      try {
        const res = await receiptService.getReceipt({ size: 999 });
        if (!res?.items?.length) return;
    
        // Gọi API lấy chi tiết hóa đơn song song
        const details = await Promise.all(
          res.items.map(async (receipt: any) => {
            const receiptDetail = await receiptService.getReceiptDetail(receipt.id);
            return { 
              date: new Date(receipt.date), // Lấy ngày tạo
              type: receipt.type, // 1: nhập, 2: xuất
              items: receiptDetail.items
            };
          })
        );
    
        // Xác định năm nhỏ nhất (earliestYear)
        const years = details.map(d => d.date.getFullYear());
        const earliestYear = Math.min(...years); 
        const currentYear = new Date().getFullYear();
    
        // Tạo object chứa dữ liệu theo từng năm & tháng
        const series: Record<string, ApexAxisChartSeries> = {};
    
        // Khởi tạo dữ liệu ít nhất 2 năm (năm hiện tại và năm trước)
        for (let year = earliestYear - 1; year <= currentYear; year++) {
          series[year.toString()] = [
            { name: t('dashboard.in_price'), data: new Array(12).fill(0) },
            { name: t('dashboard.out_price'), data: new Array(12).fill(0) },
          ];
        }
    
        // Xử lý dữ liệu nhập/xuất theo năm & tháng
        details.forEach(({ date, type, items }) => {
          const year = date.getFullYear().toString();
          const month = date.getMonth(); // 0-11
    
          const totalAmount = items.reduce(
            (sum: number, item: any) => sum + item.qty * item.product.price,
            0
          );
    
          if (type === 1) {
            series[year][0].data[month] += totalAmount; // Giá nhập
          } else if (type === 2) {
            series[year][1].data[month] += totalAmount; // Giá xuất
          }
        });
        console.log(series);
        
        setData(series)
      } catch (error) {
        console.error("Error fetching receipt data:", error);
      }
    };
    
    fetchDataReceipt();
  },[])

  const optionYears = Object.keys(data).map(year => ({ year: year }))
  

  return (
    <Card className="flex-col">
      <header className="flex w-full justify-between self-start">
        <Typography.Title level={5}>{t('dashboard.in_out_price')}</Typography.Title>
        <Select
          size="small"
          defaultValue={year}
          onChange={(value) => setYear(value)}
          fieldNames={{label: "year", value:"year"}}
          options={optionYears}
        />
      </header>
      <main className="w-full">
        <ChartArea series={data[year]} />
      </main>
    </Card>
  );
}

function ChartArea({ series }: { series: ApexAxisChartSeries }) {
  console.log(series);
  
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
