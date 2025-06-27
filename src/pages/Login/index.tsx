import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.module.css';

/**
 * 登录页面
 * @description 这是一个简单的登录页面，包含用户名和密码输入框，以及登录按钮。
 * @returns {JSX.Element} 返回登录页面组件。
 */
const Login: React.FC = () => {
  const onFinish = (values: any) => {
    // TODO: 调用登录接口
    message.success('登录成功（示例）');
  };

  return (
    <div className={styles.bg}>
      <Card className={styles.card}>
        <div className={styles.logoWrap}>
          <span className={styles.title}>博客后台管理</span>
        </div>
        <Form name="login" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}> 
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 