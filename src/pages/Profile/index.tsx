import React from 'react';
import { Card, Descriptions, Avatar, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const Profile: React.FC = () => {
  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Card className={styles.card} title={
          <span>
            <Avatar size={48} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #6a4bc6 100%)', marginRight: 16 }} />
            个人中心
          </span>
        }>
          <Descriptions column={1}>
            <Descriptions.Item label="用户名">admin</Descriptions.Item>
            <Descriptions.Item label="角色">管理员</Descriptions.Item>
            <Descriptions.Item label="邮箱">admin@example.com</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile; 