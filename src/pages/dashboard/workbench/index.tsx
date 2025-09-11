import { Avatar, Col, Row } from 'antd';
import AreaDownload from './area-download';
import TotalCard from './total-card';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BannerCard from './banner-card';
import NewInvoice from './new-invoice';
import TopAuthor from './top-authors';
import TopInstalled from './top-installed';
import { getNewOrder, getOrderByMonth, getSumCustomer, getSumFeedback, getSumOrder, getTopCustomer, getTopProduct, getTotalOrder } from '@/api/services/dashboardService';
import { fCurrencyVN, fPercent } from '@/utils/format-number';
import { customers_icon, feedback_icon, orders_icon, revenue_icon } from '@/assets/images';

function Workbench() {
  const { t } = useTranslation();
  const [noti, _setNoti] = useState<any>({});
  const [revenue, setRevenue] = useState<any>({});
  const [feedback, setFeedback] = useState<any>({});
  const [orders, setOrders] = useState<any>({});
  const [customers, setCustomers] = useState<any>({});
  const [topCustomers, setTopCustomers] = useState<any>([]);
  const [orderbyMonth, setOrderByMonth] = useState<any>({});
  const [newOrder, setNewOrder] = useState<any>([]);
  const [topTopProducts, setTopProducts] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revenueData, feedbackData, ordersData, customersData, topCustomerData, orderbyMonthData, newOrderData, topTopProductsData] = await Promise.all([
          getTotalOrder(),
          getSumFeedback(),
          getSumOrder(),
          getSumCustomer(),
          getTopCustomer(),
          getOrderByMonth(),
          getNewOrder(),
          getTopProduct()
        ]);
        setRevenue(revenueData || {});
        setFeedback(feedbackData || {});
        setOrders(ordersData || {});
        setCustomers(customersData || {});
        setTopCustomers(topCustomerData || []);
        setOrderByMonth(orderbyMonthData || {});
        setNewOrder(newOrderData || []);
        setTopProducts(topTopProductsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
    fetchData();
  },[])
  console.log(revenue);
  
  return (
    <div className="p-2">
      {noti?.id && <div
        style={{ color: 'white' }}
        className="rounded p-5  bg-[#00c0ef]">
        <h1 className="font-bold text-xl">Thông báo hệ thống!</h1>
        <p className="text-[12px]">
          <div dangerouslySetInnerHTML={{ __html: noti.content }}></div>
        </p>
      </div>}

      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={6}>
          <TotalCard
            title={t("dashboard.sales")}
            increase={revenue?.isIncrease}
            count={fCurrencyVN(revenue?.totalThisYear) || "0"}
            percent={fPercent(revenue?.percent) || "0%"}
            icon={<Avatar src={revenue_icon} style={{height: "50px", width: "50px"}} />}
          />
        </Col>
        <Col span={24} md={6}>
          <TotalCard
            title={t("dashboard.sale_returns")}
            increase={feedback?.isIncrease}
            count={feedback.countThisYear || "0"}
            percent={fPercent(feedback?.percent) || "0%"}
            icon={<Avatar src={feedback_icon} style={{height: "50px", width: "50px"}} />}
          />
        </Col>
        <Col span={24} md={6}>
          <TotalCard
            title={t("dashboard.orders")}
            increase={orders?.isIncrease}
            count={orders.countThisYear || "0"}
            percent={fPercent(orders?.percent) || "0%"}
            icon={<Avatar src={orders_icon} style={{height: "50px", width: "50px"}} />}
          />
        </Col>
        <Col span={24} md={6}>
          <TotalCard
            title={t("dashboard.customers")}
            increase={customers?.isIncrease}
            count={customers.countThisYear || "0"}
            percent={fPercent(customers?.percent) || "0%"}
            icon={<Avatar src={customers_icon} style={{height: "50px", width: "50px"}} />}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24} md={12} lg={16}>
          <BannerCard />
        </Col>
        <Col span={24} md={12} lg={8} className="flex flex-col gap-4">
          <TopAuthor data={topCustomers} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24} md={24} lg={24} className="flex flex-col gap-4">
          <AreaDownload data={orderbyMonth} />
        </Col>
        {/* <Col span={24} md={12} lg={12}>
          <AreaDownload data={orderbyMonth} />
        </Col> */}
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24} md={12} lg={16} className="flex flex-col gap-4">
          <NewInvoice data={newOrder} />
        </Col>
        <Col span={24} md={12} lg={8}>
          <TopInstalled data={topTopProducts} />
        </Col>
      </Row>
      
    </div>
  );
}

export default Workbench;
