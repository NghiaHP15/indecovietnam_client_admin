import { App, Button, Form, Input } from 'antd';

import Card from '@/components/card';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import _ from 'lodash';
import { useUserInfo } from '@/store/userStore';
import { resetPassword } from '@/api/services/authAccount.service';

type FieldType = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

type PropKey = keyof FieldType;

type ErrorOption = {
  [key: string]: string | null;
};

const emptyValidate: ErrorOption = {
  oldPassword: null,
  newPassword: null,
  confirmPassword: null,
};

export default function SecurityTab() {
  const { notification } = App.useApp();
  const { t } = useTranslation();
  const { email } = useUserInfo();
  const initFormValues = {
    email,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  const [data, setData] = useState<FieldType>(initFormValues);
  const [errors, setErrors] = useState<ErrorOption>(emptyValidate);
  const [loading, setLoading] = useState<boolean>(false);

  const performValidate = async (props: PropKey[], _currentParam: any) => {
    let _errors: ErrorOption = _.cloneDeep(errors);
    let _setParam = _currentParam ? _currentParam : data;
    if (props.length === 0) {
      for (const property in _errors) {
        props.push(property as PropKey);
      }
    }
    props.forEach((prop) => {
      switch (prop) {
        case 'oldPassword':
          _errors[prop] = null;
          if (!_setParam[prop]) {
            _errors[prop] = t('user.account.error.old_password');
          }
          break;
        case 'newPassword':
          _errors[prop] = null;
          if (!_setParam[prop]) {
            _errors[prop] = t('user.account.error.new_password');
          }
          break;
        case 'confirmPassword':
          _errors[prop] = null;
          if (!_setParam[prop]) {
            _errors[prop] = t('user.account.error.confirm_password');
          } else if (_setParam['newPassword'] !== _setParam['confirmPassword']) {
            _errors[prop] = t('user.account.error.password_not_match');
          }
          break;
        default:
          break;
      }
    });
  
    setErrors(_errors);
  
    let isValid = true;
    for (const key in _errors) {
      if (_errors[key]) {
        isValid = false;
      }
    }
    return isValid;
  };
  
  const handleClick = async () => {
    let _payload: any = _.cloneDeep(data);
    const isValid = await performValidate([], _payload);
    if(!isValid) return;
    setLoading(true);
    try {
      await resetPassword(data);
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
    performValidate([field as PropKey], _param);
  }

  return (
    <Card className="!h-auto flex-col">
      <Form
        layout="vertical"
        initialValues={initFormValues}
        labelCol={{ span: 8 }}
        className="w-full"
      >
        <Form.Item 
          label={t('user.account.old_password')}
          required
          validateStatus={errors['oldPassword'] ? 'error' : ''}
          help={errors['oldPassword']}
        >
          <Input.Password
            value={data.oldPassword}
            placeholder={t('user.account.old_password')}
            onChange={(e) => onChange(e.target.value, 'oldPassword')}
          />
        </Form.Item>

        <Form.Item 
          label={t('user.account.new_password')}
          required
          validateStatus={errors['newPassword'] ? 'error' : ''}
          help={errors['newPassword']}
        >
          <Input.Password 
            value={data.newPassword}
            placeholder={t('user.account.new_password')}
            onChange={(e) => onChange(e.target.value, 'newPassword')}
          />
        </Form.Item>

        <Form.Item 
          label={t('user.account.confirm_password')}
          required
          validateStatus={errors['confirmPassword'] ? 'error' : ''}
          help={errors['confirmPassword']}
        >
          <Input.Password 
            value={data.confirmPassword}
            placeholder={t('user.account.confirm_password')}
            onChange={(e) => onChange(e.target.value, 'confirmPassword')}
          />
        </Form.Item>
      </Form>
      <div className="flex w-full justify-end">
        <Button type="primary" onClick={handleClick} loading={loading}>
          {t('common.update')}
        </Button>
      </div>
    </Card>
  );
}
