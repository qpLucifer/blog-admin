import React from 'react';
import { Card, Button, Space, Typography, Tooltip, Dropdown } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  SettingOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { TableToolbarProps, IMenuItem } from '../../../types';
import styles from './index.module.css';

const { Title } = Typography;

const TableToolbar: React.FC<TableToolbarProps> = ({
  title,
  showAdd = true,
  addButtonText = '新增',
  onAdd,
  onReload,
  loading = false,
  selectedRowKeys = [],
  onBatchDelete,
  onExport,
  onImport,
  extra,
  operations = {},
}) => {
  const hasSelected = selectedRowKeys.length > 0;

  const moreMenuItems = [
    operations.export && {
      key: 'export',
      icon: <DownloadOutlined />,
      label: '导出数据',
      onClick: onExport,
    },
    operations.import && {
      key: 'import',
      icon: <UploadOutlined />,
      label: '导入数据',
      onClick: onImport,
    },
    operations.batchDelete &&
      hasSelected && {
        key: 'batchDelete',
        icon: <SettingOutlined />,
        label: `批量删除 (${selectedRowKeys.length})`,
        onClick: onBatchDelete,
        danger: true,
      },
  ].filter(Boolean);

  return (
    <Card className={styles.toolbar} size='small'>
      <div className={styles.toolbarContent}>
        <div className={styles.toolbarLeft}>
          <Title level={4} className={styles.title}>
            {title}
          </Title>
          {hasSelected && (
            <div className={styles.selectedInfo}>
              已选择 <span className={styles.selectedCount}>{selectedRowKeys.length}</span> 项
            </div>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <Space size='middle'>
            {extra}

            {showAdd && operations.create && (
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={onAdd}
                className={styles.primaryButton}
              >
                {addButtonText}
              </Button>
            )}

            <Tooltip title='刷新'>
              <Button
                icon={<ReloadOutlined />}
                onClick={onReload}
                loading={loading}
                className={styles.iconButton}
              />
            </Tooltip>

            {moreMenuItems.length > 0 && (
              <Dropdown
                menu={{ items: moreMenuItems as IMenuItem[] }}
                placement='bottomRight'
                trigger={['click']}
              >
                <Button icon={<MoreOutlined />} className={styles.iconButton} />
              </Dropdown>
            )}
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default TableToolbar;
