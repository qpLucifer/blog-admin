import React from 'react';
import { Table, Button, Space, Card } from 'antd';
import styles from './index.module.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '菜单名', dataIndex: 'name' },
  { title: '路径', dataIndex: 'path' },
  { title: '排序', dataIndex: 'order' },
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
  { id: 1, name: '首页', path: '/dashboard', order: 1 },
  { id: 2, name: '用户管理', path: '/users', order: 2 }
];

const Menus: React.FC = () => (
  <div className={styles.root}>
    <h2 className={styles.title}>菜单管理</h2>
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

export default Menus; 