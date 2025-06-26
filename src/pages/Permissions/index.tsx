import React from 'react';
import CustomTable from '../../components/CustomTable';
import styles from './index.module.css';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '权限名', dataIndex: 'name' },
  { title: '描述', dataIndex: 'description' },
];

const data = [
  { id: 1, name: 'user:read', description: '查看用户信息' },
  { id: 2, name: 'user:write', description: '管理用户' }
];

const Permissions: React.FC = () => (
  <div className={styles.root}>
    <h2 className={styles.title}>权限管理</h2>
    <CustomTable columns={columns} dataSource={data} rowKey="id" />
  </div>
);

export default Permissions; 