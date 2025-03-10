import Card from '@/components/card';
import { Avatar } from 'antd';

type Props = {
  title: string;
  count: string;
  icon: string
};
export default function TotalCard({ title, count, icon }: Props) {
  return (
    <Card>
      <div className="flex-grow">
        <h6 className="text-sm font-medium">{title}</h6>
        <div className="mb-2 mt-4 flex flex-row">
        </div>
        <h3 className="text-2xl font-bold">{count}</h3>
      </div>
      <Avatar src={icon} shape='square' size={75} />
    </Card>
  );
}

