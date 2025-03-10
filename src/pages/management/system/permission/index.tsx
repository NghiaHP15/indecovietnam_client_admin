import { Button, Card } from 'antd';
import { useState } from 'react';

import PermissionModal, { type PermissionModalProps } from './permission-modal';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';

const defaultPermissionValue: Permission = {
  id: '',
  parentId: '',
  name: '',
  label: '',
  route: '',
  component: '',
  icon: '',
  hide: false,
  status: BasicStatus.ENABLE,
  type: PermissionType.CATALOGUE,
};
export default function PermissionPage() {

  const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps>({
    formValue: { ...defaultPermissionValue },
    title: 'New',
    show: false,
    onOk: () => {
      setPermissionModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setPermissionModalProps((prev) => ({ ...prev, show: false }));
    },
  });

  const onCreate = (parentId?: string) => {
    setPermissionModalProps((prev) => ({
      ...prev,
      show: true,
      ...defaultPermissionValue,
      title: 'New',
      formValue: { ...defaultPermissionValue, parentId: parentId ?? '' },
    }));
  };

  return (
    <Card
      title="Permission List"
      extra={
        <Button type="primary" onClick={() => onCreate()}>
          New
        </Button>
      }
    >
      {/* <Table
        rowKey="id"
        size="small"
        scroll={{ x: 'max-content', y: '100%' }}
        pagination={false}
        columns={columns}
        dataSource={permissions}
      /> */}

      <PermissionModal {...permissionModalProps} />
    </Card>
  );
}
