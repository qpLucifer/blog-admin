import React from 'react';
import CustomTable from '../../components/CustomTable';
import styles from './index.module.css';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '作者', dataIndex: 'auth' },
  { title: '每日一句', dataIndex: 'day_sentence' },
];

const data = [
  { id: 1, auth: '佚名', day_sentence: '生活不止眼前的苟且，还有诗和远方。' }
];

const DaySentence: React.FC = () => (
  <div className={styles.root}>
    <h2 className={styles.title}>每日一句管理</h2>
    <CustomTable columns={columns} dataSource={data} rowKey="id" />
  </div>
);

export default DaySentence; 