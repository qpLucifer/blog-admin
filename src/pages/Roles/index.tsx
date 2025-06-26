import React from 'react';
import { Table, Button, Space, Card } from 'antd';
import styles from './index.module.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '角色名', dataIndex: 'name' },
  { title: '描述', dataIndex: 'description' },
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
  { id: 1, name: 'admin', description: '系统管理员' },
  { id: 2, name: 'editor', description: '内容编辑' }
];

const Roles: React.FC = () => (
  <div className={styles.root}>
    <h2 className={styles.title}>角色管理</h2>
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

export default Roles; 