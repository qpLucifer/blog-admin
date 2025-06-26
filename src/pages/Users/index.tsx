import React from 'react';
import { Table, Button, Space, Card } from 'antd';
import styles from './index.module.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '用户名', dataIndex: 'username' },
  { title: '角色', dataIndex: 'roles', render: (roles: string[]) => roles?.join(', ') },
  {
    title: '操作',
    key: 'action',
    render: (_: any, record: any) => (
      <Space>
        <Button type="link" icon={<EditOutlined />} size="small">编辑</Button>
        <Button type="link" icon={<DeleteOutlined />} size="small" danger>删除</Button>
      </Space>
    )
  }
];

const data = [
  { id: 1, username: 'admin', roles: ['admin'] },
  { id: 2, username: 'editor', roles: ['editor'] }
];

const Users: React.FC = () => (
  <div className={styles.root}>
    <h2 className={styles.title}>用户管理</h2>
    <Card style={{ borderRadius: 16 }}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  </div>
);

export default Users; 