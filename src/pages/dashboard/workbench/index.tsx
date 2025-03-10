import { Col, Row } from 'antd';
import AreaDownload from './area-download';
import NewInvoice from './new-invoice';
import TopAuthor from './top-authors';
import TopInstalled from './top-installed';
import TopRelated from './top-related';
import TotalCard from './total-card';
import { useEffect, useState } from 'react';
import productService from '@/api/services/productService';
import { useTranslation } from 'react-i18next';
import productImage from "@/assets/images/icon/product.png";
import moneyImage from "@/assets/images/icon/money.png";
import billImage from "@/assets/images/icon/bill.png";
import warehouseService from '@/api/services/warehouseService';
import receiptService from '@/api/services/receiptService';
import CurrentProduct from './current-download';

function Workbench() {
  const { t } = useTranslation();
  const [noti, _setNoti] = useState<any>({});
  const [totalProduct, setTotalProduct] = useState<Number>(0);
  const [totalProductPrice, setTotalProductPrice] = useState<Number>(0);
  const [totalRecieptOutPrice, setTotalRecieptOutPrice] = useState<Number>(0);
  
  useEffect(()=>{
    loadData()
  },[])

  const loadData = async () => {
    try {
      const resProduct = await productService.internalProducts({size: 999});
      const resWarehouse = await warehouseService.getWarehouse({size: 999})
      const resReceipt = await receiptService.getReceipt({size: 999})
      totalPriceOutReceipt(resReceipt);
      setTotalProduct(resProduct.totalRecord);
      setTotalProductPrice(await totalPrice(resWarehouse))
      setTotalRecieptOutPrice(await totalPriceOutReceipt(resReceipt))
      
    } catch (e){
      console.log(e);
    }
  }

  const totalPrice = async (data: any): Promise<number> => {
    const totals = await Promise.all(
        data.items.map(async (item: any) => {
            const wareHouseStorage = await warehouseService.warehousestorage(item.id, { size: 999 });
            return wareHouseStorage.items.reduce(
                (sum: number, item: any) => sum + item.qty * item.product.price,
                0
            );
        })
    );
    return totals.reduce((acc, curr) => acc + curr, 0);
  };

  const totalPriceOutReceipt = async (data: any): Promise<number> => {
    const totals = await Promise.all(
        data.items.map(async (item: any) => {
          if(item.type === 2){
            const wareHouseStorage = await receiptService.getReceiptDetail(item.id);
            return wareHouseStorage.items.reduce(
                (sum: number, item: any) => sum + item.qty * item.product.price,
                0
            );
          }
        })
    );
    return totals.reduce((acc, curr) => acc + curr, 0);
  };

  console.log(import.meta.env); 

  return (
    <div className="p-2 re">
      {noti?.id && <div
        style={{ color: 'white' }}
        className="rounded p-5  bg-[#00c0ef]">
        <h1 className="font-bold text-xl">Thông báo hệ thống!</h1>
        <p className="text-[12px]">
          <div dangerouslySetInnerHTML={{ __html: noti.content }}></div>
        </p>
      </div>}

      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={8}>
          <TotalCard
            title="Total Active Users"
            increase
            count="18,765"
            percent="2.6%"
            chartData={[22, 8, 35, 50, 82, 84, 77, 12, 87, 43]}

          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={12} lg={16}>
          <AreaDownload />
        </Col>
      </Row>
    </div>
  );
}

export default Workbench;
