import Icons from '@/assets/icons';
import Card from '@/components/card';
import { Flex } from 'antd';

type Props = {
  title: string;
  increase: boolean;
  percent: string;
  count: string;
  icon?: React.ReactNode;
};
export default function TotalCard({ title, increase, count, percent, icon }: Props) {
  return (
    <Card className='!rounded-md !p-3'>
      <div className="flex-grow">
        <Flex justify='space-between' align='center'>
          <h6 className="text-sm font-medium">{title}</h6>
        </Flex>
        <div className='absolute top-3 right-3'>
          {icon}
        </div>
        <div className="mb-2 mt-4 flex flex-row">
          {increase ? (
            <Icons.ICRise style={{ height: '24px', width: '24px', background: '#00974E29', borderRadius: '50%', padding: "5px"}} />
          ) : (
            <Icons.ICDecline style={{ height: '24px', width: '24px', background: '#FF456029', borderRadius: '50%', padding: "5px"}} />
          )}
          <div className="ml-2">
            <span>{increase ? '+' : '-'}</span>
            <span>{percent}</span>
          </div>
        </div>
        <div className='flex justify-end items-end'>
          <h4 className="text-2xl font-medium">{count}</h4>
        </div>
      </div>
    </Card>
  );
}

