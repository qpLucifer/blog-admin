import React from 'react';
import { Card } from 'antd';
import styles from './index.module.css';

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className,
  loading = false,
}) => {
  return (
    <Card
      className={`${styles.tableContainer} ${className || ''}`}
      loading={loading}
      size='small'
      bodyStyle={{ padding: 0 }}
    >
      <div className={styles.tableWrapper}>{children}</div>
    </Card>
  );
};

export default TableContainer;
