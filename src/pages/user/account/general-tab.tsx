import { faker } from '@faker-js/faker';
import { App, Button, Col, DatePicker, Form, Input, Row, Select, Space, Switch } from 'antd';

import Card from '@/components/card';
import { UploadAvatar } from '@/components/upload';
import { useUserInfo } from '@/store/userStore';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import { GENDER_OPTIONS, POSITION_EMPLOYEEE } from '#/enum';
import { publicId } from '@/utils/publickey';
import { deleteImage, uploadImage } from '@/api/services/uploadService';
import { updateEmployee } from '@/api/services/employeeService';

type FieldType = {
  id: string;
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  about: string;
  gender?: string;
  position?: string;
  status_active?: string;
  avatar?: string;
  date_of_birth?: string;
};

type PropKey = keyof FieldType;

export default function GeneralTab() {
  const { notification } = App.useApp();
  const { id, avatar, fullname, status_active, email, phone, address, position, date_of_birth, gender, about  } = useUserInfo();
  const [loadImge, setLoadImage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const  { t } = useTranslation();

  const initFormValues = {
    id: id || faker.string.uuid(),
    fullname,
    email: email || faker.internet.email(),
    phone: phone || faker.phone.number(),
    address: address || faker.location.county(),
    gender: gender || faker.person.gender(),
    date_of_birth: date_of_birth || faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    position: position,
    about: about || faker.lorem.paragraphs(),
    status_active: status_active || "active",
    avatar: avatar || faker.image.avatar(),
  };
  const [ data, setData ] = useState<any>(initFormValues);

  const handleClick = async () => {
    try {
      setLoading(true);
      await updateEmployee(data.id, data);
      notification.success({
        message: 'Update success!',
        duration: 3,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (value: string | boolean | null, field: PropKey) => {
    const _param: FieldType = _.cloneDeep(data);
    (_param as any)[field] = value;
    setData(_param);
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} lg={8}>
        <Card className="flex-col !px-6 !pb-10 !pt-20">
          <UploadAvatar 
            loading={loadImge}
            defaultAvatar={data.avatar}
            customRequest={async ({ file, onSuccess, onError}) => {
              try{
                setLoadImage(true);
                const formData = new FormData();
                formData.append('image', file as Blob);
                if(data.image){
                  const id = publicId(data.image);
                  id && await deleteImage(id);
                }
                const res = await uploadImage(formData);
                if(res){
                  onChange(res.url, "avatar");
                  onSuccess?.(res, file as any);
                }
              } catch (error) {
               onError?.(error as any); 
              } finally {
                setLoadImage(false);
              }
            }
          }
          />
          <Space className="py-6">
            <div>{t('user.account.status_active')}</div>
            <Switch size="small" value={data.status_active} onChange={(value) => {
              let _value:string;
              if(value === true) _value = "active";
              else _value = "inactive";
              onChange(_value, 'status_active')
            }} />
          </Space>
        </Card>
      </Col>
      <Col span={24} lg={16}>
        <Card>
          <Form
            layout="vertical"
            labelCol={{ span: 8 }}
            className="w-full"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t("user.account.fullname")}>
                  <Input value={data.fullname} onChange={(e) => onChange(e.target.value, 'fullname')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldType> label="Email">
                  <Input value={data.email} onChange={(e) => onChange(e.target.value, 'email')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<FieldType> label={t('user.account.phone')} >
                  <Input value={data.phone} onChange={(e) => onChange(e.target.value, 'phone')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldType> label={t('user.account.position')}>
                  <Select 
                    options={POSITION_EMPLOYEEE.list.map(item => ({ label: t(item.label), value: item.value }))}
                    fieldNames={{ label: 'label', value: 'value' }}
                    value={data.position}
                    onChange={(value) => onChange(value, 'position')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<FieldType> label={t('user.account.gender')}>
                  <Select 
                    options={GENDER_OPTIONS.list.map(item => ({ label: t(item.label), value: item.value }))}
                    fieldNames={{ label: 'label', value: 'value' }}
                    value={data.gender}
                    onChange={(value) => onChange(value, 'gender')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('user.account.date_of_birth')}>
                  <DatePicker
                    value={data?.date_of_birth ? dayjs(data?.date_of_birth) : null}
                    onChange={(e) => onChange(e ? e.toISOString() : null, "date_of_birth")}
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item<FieldType> label={t('user.account.about')}>
              <Input.TextArea />
            </Form.Item>

            <div className="flex w-full justify-end">
              <Button type="primary" onClick={handleClick} loading={loading}>
                {t('common.update')}
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
