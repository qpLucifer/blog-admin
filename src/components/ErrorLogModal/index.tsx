import React, { useEffect } from 'react';
import { Modal, Statistic, Row, Col, Card, List, Tag, Space, Button, Typography } from 'antd';
import { getFailedLogStats, markFailedLogsRead } from '../../api/logs';
import { useApi } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FailedStatsResponse, ErrorLogModalProps } from '../../types';

const ErrorLogModal: React.FC<ErrorLogModalProps> = ({ open, onClose, onHandled }) => {
  const navigate = useNavigate();
  const {
    data,
    loading,
    execute: fetchFailedStats,
  } = useApi<FailedStatsResponse>(getFailedLogStats);
  const { loading: handleLoading, execute: handleMarkRead } = useApi(markFailedLogsRead, {
    showSuccess: true,
    successMessage: '已将失败日志标记为已读',
  });

  useEffect(() => {
    if (open) {
      fetchFailedStats();
    }
  }, [open, fetchFailedStats]);

  const gotoLogsPage = () => {
    onClose();
    navigate('/system/logs?status=failed');
  };

  const handleQuickProcess = async () => {
    const res = await handleMarkRead();
    if (res !== null) {
      // 处理成功后刷新统计
      await fetchFailedStats();
      onHandled?.();
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          失败日志提醒
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={gotoLogsPage}>去日志管理处理</Button>
          <Button
            type='primary'
            loading={handleLoading}
            onClick={handleQuickProcess}
            disabled={(data?.unreadFailed || 0) === 0}
          >
            一键标记为已读
          </Button>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title='总失败日志' value={data?.totalFailed || 0} loading={loading} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title='未读失败日志' value={data?.unreadFailed || 0} loading={loading} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title='需要关注'
              value={data?.moduleStats?.[0]?.count || 0}
              suffix={data?.moduleStats?.[0]?.module || '-'}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }} title='按模块统计（失败）'>
        <List
          size='small'
          dataSource={data?.moduleStats || []}
          renderItem={item => (
            <List.Item>
              <Space>
                <Tag color='volcano'>{item.module}</Tag>
                <Typography.Text strong>{item.count}</Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </Modal>
  );
};

export default ErrorLogModal;
