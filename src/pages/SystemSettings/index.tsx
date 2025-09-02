import React, { useEffect } from 'react';
import { Input } from 'antd';
import { Card, Form, InputNumber, Switch, Button, Space, message, Popconfirm } from 'antd';
import { getSystemSettings, updateSystemSettings, resetSystemSettings } from '../../api/system';
import { SystemSettings } from '../../types';
import pageStyles from '../../styles/page-layout.module.css';

const SystemSettingsPage: React.FC = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        const res = await getSystemSettings();
        // 某些 api 封装可能返回 { code, data }，此处兼容
        const data: SystemSettings = (res as any)?.rateLimit
          ? (res as any)
          : (res as any)?.data || (res as any);
        form.setFieldsValue(data);
      } catch (e) {
        message.error('获取系统设置失败');
      }
    })();
  }, [form]);

  const onFinish = async (values: SystemSettings) => {
    try {
      await updateSystemSettings(values);
      message.success('系统设置已保存');
    } catch (e: any) {
      const msg = e?.response?.data?.message || '保存失败';
      if (e?.response?.status === 409) {
        message.warning('设置已被他人修改，正在为你刷新最新配置...');
        try {
          const res = await getSystemSettings();
          const data: SystemSettings = (res as any)?.rateLimit
            ? (res as any)
            : (res as any)?.data || (res as any);
          form.setFieldsValue(data);
        } catch (e2) {}
      } else {
        message.error(msg);
      }
    }
  };

  return (
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.pageContent}>
        <Card title='速率限制器设置' style={{ marginBottom: 16 }}>
          <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item
              label='全局窗口（毫秒）'
              name={['rateLimit', 'windowMs']}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} step={1000} style={{ width: 240 }} />
            </Form.Item>
            <Form.Item
              label='全局最大请求数'
              name={['rateLimit', 'max']}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: 240 }} />
            </Form.Item>
            <Space size='large'>
              <Form.Item label='登录窗口（毫秒）' name={['rateLimit', 'loginWindowMs']}>
                <InputNumber min={0} step={1000} style={{ width: 240 }} />
              </Form.Item>
              <Form.Item label='登录最大尝试次数' name={['rateLimit', 'loginMax']}>
                <InputNumber min={0} style={{ width: 240 }} />
              </Form.Item>
            </Space>
            <Space size='large'>
              <Form.Item label='上传窗口（毫秒）' name={['rateLimit', 'uploadWindowMs']}>
                <InputNumber min={0} step={1000} style={{ width: 240 }} />
              </Form.Item>
              <Form.Item label='上传最大次数' name={['rateLimit', 'uploadMax']}>
                <InputNumber min={0} style={{ width: 240 }} />
              </Form.Item>
            </Space>

            <Card title='验证规则设置' style={{ marginTop: 16 }}>
              <Space size='large'>
                <Form.Item label='用户名最短长度' name={['validation', 'usernameMin']}>
                  <InputNumber min={1} style={{ width: 180 }} />
                </Form.Item>
                <Form.Item label='用户名最长长度' name={['validation', 'usernameMax']}>
                  <InputNumber min={1} style={{ width: 180 }} />
                </Form.Item>
              </Space>
              <Space size='large'>
                <Form.Item label='密码最短长度' name={['validation', 'passwordMin']}>
                  <InputNumber min={1} style={{ width: 180 }} />
                </Form.Item>
                <Form.Item label='密码最长长度' name={['validation', 'passwordMax']}>
                  <InputNumber min={1} style={{ width: 180 }} />
                </Form.Item>
              </Space>
              <Form.Item
                label='强密码校验（大小写+数字）'
                name={['validation', 'enforceStrongPassword']}
                valuePropName='checked'
              >
                <Switch />
              </Form.Item>
            </Card>
            <Card title='安全设置（CORS / Helmet）' style={{ marginTop: 16 }}>
              <Form.Item
                label='CORS 白名单（逗号分隔）'
                name={['security', 'corsOrigins']}
                getValueFromEvent={v => v?.target?.value}
                getValueProps={v => ({ value: Array.isArray(v) ? v.join(',') : v })}
              >
                <Input placeholder='例如：http://localhost:3001,http://localhost:3000' />
              </Form.Item>
              <Space size='large'>
                <Form.Item
                  label='启用 Helmet'
                  name={['security', 'helmetEnabled']}
                  valuePropName='checked'
                >
                  <Switch />
                </Form.Item>
              </Space>
            </Card>

            <Card title='模块开关' style={{ marginTop: 16 }}>
              <Space size='large' direction='vertical' style={{ width: '100%' }}>
                <Form.Item
                  label='启用上传模块'
                  name={['validation', 'uploadEnabled']}
                  valuePropName='checked'
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label='启用评论模块'
                  name={['validation', 'commentsEnabled']}
                  valuePropName='checked'
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label='启用用户注册'
                  name={['validation', 'registrationEnabled']}
                  valuePropName='checked'
                >
                  <Switch />
                </Form.Item>
              </Space>
            </Card>

            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <Space>
                <Button type='primary' htmlType='submit'>
                  保存
                </Button>
                <Button onClick={() => form.resetFields()}>重置</Button>
                <Popconfirm
                  title='确定要重置为默认设置吗？'
                  description='此操作将覆盖当前配置，且立即生效'
                  onConfirm={async () => {
                    try {
                      const res = await resetSystemSettings();
                      const data: any = (res as any)?.data || res;
                      form.setFieldsValue(data);
                      message.success('已重置为默认设置');
                    } catch (e) {
                      message.error('重置失败');
                    }
                  }}
                >
                  <Button danger>重置为默认</Button>
                </Popconfirm>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
