import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.module.css';
// import logo from '../../assets/logo.svg';

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    // TODO: 调用登录接口
    message.success('登录成功（示例）');
  };

  return (
    <div className={styles.bg}>
      <Card className={styles.card}>
        <div className={styles.logoWrap}>
          {/* <img src={logo} alt="logo" className={styles.logo} /> */}
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