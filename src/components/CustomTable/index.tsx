import React from 'react';
import { Table } from 'antd';
import styles from './index.module.css';

const CustomTable = (props: any) => (
  <div className={styles.tableWrap}>
    <Table {...props} />
  </div>
);

export default CustomTable; 