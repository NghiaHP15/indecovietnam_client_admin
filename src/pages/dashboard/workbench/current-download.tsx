import { Select, Typography } from 'antd';
import Card from '@/components/card';
import Chart from '@/components/chart/chart';
import useChart from '@/components/chart/useChart';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import warehouseService from '@/api/services/warehouseService';
import { Warehouse } from '#/entity';

export default function CurrentProduct() {
  const { t } = useTranslation();
  const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
  const [warehouseId, setWarehouseId] = useState<string>('')
  const [warehousestorage, setWarehousestorage] = useState<any>({ label: [], value: []})

  useEffect(() => {
    const loadData = async () => {
      try {
        const resWarehouse = await warehouseService.getWarehouse({ size: 999 });
        if (resWarehouse?.totalRecord > 0) {
          setWarehouse(resWarehouse.items)
          setWarehouseId(resWarehouse.items[0]?.id);
        }
      } catch (e) {
        console.error("Error fetching warehouse:", e);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const fetchWarehouseStorage = async () => {
      console.log(warehouseId);
      
      if (!warehouseId) return;
      try {
        const res = await warehouseService.warehousestorage(warehouseId, { size: 999 });

      if (!res?.items) return;

      const topProducts = res.items
        .sort((a: any, b: any) => b.qty - a.qty)
        .slice(0, 10);

      const _warehousestorage = {
        label: [...topProducts.map((item: any) => item.product.name)],
        value: [...topProducts.map((item: any) => item.qty)],
      };

      setWarehousestorage(_warehousestorage);
        
      } catch (e) {
        console.error("Error fetching warehouse storage:", e);
      }
    };

    fetchWarehouseStorage();
  }, [warehouseId]);
  
  

  return (
    <Card className="flex-col">
      <header className="self-start w-full">
        <div className="flex justify-between mb-2">
          <Typography.Title level={5}>{t('dashboard.amount_product_on_warehouse')}:</Typography.Title>
          <Select
            style={{
              width: 150,
            }} 
            value={warehouseId}
            options={warehouse}
            onChange={(e) => setWarehouseId(e)} 
            fieldNames={{label: "name", value: "id"}}
          />
        </div>
      </header>
      <main>
        <ChartDonut data={warehousestorage} />
      </main>
    </Card>
  );
}

type ChartData = {
  label: string[];
  value: number[];
};

type PropType = {
  data: ChartData;
};

function ChartDonut({ data }: PropType) {
  const { label, value } = data;
  const _value = value.map(item => Math.abs(item))
  

  const chartOptions = useChart({
    labels: label,
    stroke: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      fillSeriesColor: false,
    },
    chart: {
      width: 250,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            total: {
              fontSize: '12px',
            },
            value: {
              fontSize: '18px',
              fontWeight: 700,
            },
          },
        },
      },
    },
  });

  return <Chart type="donut" series={_value} options={chartOptions} height={360} />;
}
