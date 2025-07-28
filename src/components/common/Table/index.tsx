import React, { memo, useMemo, useCallback } from 'react';
import { Table, Empty, Spin, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { CommonTableProps } from '../../../types';
import styles from './index.module.css';

/**
 * 通用表格组件
 * 整合了加载状态、错误处理、空数据等常见功能
 */
function CommonTable<T = any>({
  dataSource,
  columns,
  loading = false,
  error = null,
  pagination,
  onReload,
  rowKey = 'id',
  scroll,
  className,
  size = 'middle',
}: CommonTableProps<T>) {
  // 使用useCallback优化渲染函数
  const renderLoading = useCallback(
    () => (
      <div className={styles.loadingContainer}>
        <Spin size='large' />
        <div className={styles.loadingText}>加载中...</div>
      </div>
    ),
    []
  );

  // 使用useCallback优化渲染函数
  const renderError = useCallback(
    () => (
      <div className={styles.errorContainer}>
        <Empty
          description={
            <div>
              <div className={styles.errorTitle}>加载失败</div>
              <div className={styles.errorMessage}>{error}</div>
              {onReload && (
                <Button
                  type='primary'
                  icon={<ReloadOutlined />}
                  onClick={onReload}
                  className={styles.reloadButton}
                >
                  重新加载
                </Button>
              )}
            </div>
          }
        />
      </div>
    ),
    [error, onReload]
  );

  // 渲染空数据状态
  const renderEmpty = useCallback(
    () => <Empty description='暂无数据' image={Empty.PRESENTED_IMAGE_SIMPLE} />,
    []
  );

  // 使用useMemo优化分页配置
  const paginationConfig = useMemo(() => {
    if (!pagination) return false;
    return {
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number, range: [number, number]) =>
        `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
      ...pagination,
    };
  }, [pagination]);

  // 渲染表格内容
  const renderTable = useCallback(() => {
    if (loading) {
      return renderLoading();
    }

    if (error) {
      return renderError();
    }

    if (!dataSource || dataSource.length === 0) {
      return renderEmpty();
    }

    return (
      <Table<T>
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        pagination={paginationConfig}
        scroll={scroll}
        size={size}
        className={className}
        locale={{ emptyText: renderEmpty() }}
      />
    );
  }, [
    loading,
    error,
    dataSource,
    columns,
    rowKey,
    paginationConfig,
    scroll,
    size,
    className,
    renderLoading,
    renderError,
    renderEmpty,
  ]);

  return <div className={styles.tableContainer}>{renderTable()}</div>;
}

// 使用memo优化组件性能
export default memo(CommonTable) as typeof CommonTable;
