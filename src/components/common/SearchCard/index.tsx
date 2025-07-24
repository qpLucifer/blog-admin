import React from 'react';
import { Card, Form, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.module.css';

interface SearchCardProps {
  title?: string;
  form: any;
  onFinish: (values: any) => void;
  onReset: () => void;
  loading?: boolean;
  children: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  showCollapse?: boolean;
}

const SearchCard: React.FC<SearchCardProps> = ({
  title = '查询条件',
  form,
  onFinish,
  onReset,
  loading = false,
  children,
  collapsed = false,
  onToggleCollapse,
  showCollapse = true,
}) => {
  return (
    <Card
      className={styles.searchCard}
      size='small'
      title={
        <div className={styles.cardTitle}>
          <SearchOutlined className={styles.titleIcon} />
          <span>{title}</span>
        </div>
      }
      extra={
        showCollapse && (
          <Button
            type='link'
            size='small'
            onClick={onToggleCollapse}
            className={styles.collapseBtn}
          >
            {collapsed ? '展开' : '收起'}
          </Button>
        )
      }
    >
      <div className={`${styles.searchContent} ${collapsed ? styles.collapsed : ''}`}>
        <Form form={form} layout='inline' onFinish={onFinish} className={styles.searchForm}>
          <div className={styles.formFields}>{children}</div>
          <div className={styles.formActions}>
            <Space>
              <Button type='primary' htmlType='submit' icon={<SearchOutlined />} loading={loading}>
                查询
              </Button>
              <Button onClick={onReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </Card>
  );
};

export default SearchCard;
