import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginUser, selectLoading } from '../../store/slices/authSlice';
import styles from './index.module.css';
import wsManager from '../../utils/websocket';

/**
 * 登录页面
 * @description 这是一个简单的登录页面，包含用户名和密码输入框，以及登录按钮。
 * @returns {JSX.Element} 返回登录页面组件。
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectLoading);

  // 获取重定向地址，如果没有则默认到dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onFinish = async (values: any) => {
    try {
      //unwrap 用于等待异步操作完成并返回结果
      await dispatch(loginUser(values)).unwrap();
      message.success('登录成功');
      wsManager.connect(); // 登录成功后连接WebSocket
      // 重定向到之前的页面或dashboard
      navigate(from, { replace: true });
    } catch (error) {
      // 错误已经在Redux中处理，这里不需要额外处理
      console.error('登录失败:', error);
    }
  };

  return (
    <div className={styles.bg}>
      <Card className={styles.card}>
        <div className={styles.logoWrap}>
          <span className={styles.title}>博客后台管理</span>
        </div>
        <Form name='login' onFinish={onFinish}>
          <Form.Item name='username' rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder='用户名' size='large' />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder='密码' size='large' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block size='large' loading={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
