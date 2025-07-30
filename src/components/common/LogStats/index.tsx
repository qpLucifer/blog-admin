import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Typography, Space, Tag } from 'antd';
import {
  FileTextOutlined,
  BarChartOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  BugOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { LogStats as LogStatsType, LogFileType } from '../../../types';
import { formatFileSize } from '../../../utils/tableUtils';
import { formatDateTime } from '../../../utils/dateUtils';
import styles from './index.module.css';

const { Text } = Typography;

interface LogStatsProps {
  stats: LogStatsType;
  loading?: boolean;
}

const LogStats: React.FC<LogStatsProps> = ({ stats, loading = false }) => {
  // 获取文件类型配置
  const getFileTypeConfig = (type: LogFileType) => {
    const configs = {
      error: {
        color: '#ff4d4f',
        icon: <ExclamationCircleOutlined />,
        text: '错误日志',
        description: '系统错误和异常信息',
      },
      auth: {
        color: '#1890ff',
        icon: <InfoCircleOutlined />,
        text: '认证日志',
        description: '用户登录和权限验证',
      },
      business: {
        color: '#52c41a',
        icon: <BarChartOutlined />,
        text: '业务日志',
        description: '业务逻辑和操作记录',
      },
      system: {
        color: '#722ed1',
        icon: <BugOutlined />,
        text: '系统日志',
        description: '系统运行和性能信息',
      },
      api: {
        color: '#fa8c16',
        icon: <ApiOutlined />,
        text: 'API日志',
        description: 'API请求和响应记录',
      },
      security: {
        color: '#f5222d',
        icon: <SecurityScanOutlined />,
        text: '安全日志',
        description: '安全事件和威胁检测',
      },
      database: {
        color: '#13c2c2',
        icon: <DatabaseOutlined />,
        text: '数据库日志',
        description: '数据库操作和查询记录',
      },
    };
    return configs[type] || configs.system;
  };

  // 计算文件类型分布百分比
  const getTypePercentage = (count: number) => {
    return stats.totalFiles > 0 ? Math.round((count / stats.totalFiles) * 100) : 0;
  };

  // 获取最大文件类型
  const getMaxFileType = () => {
    const types = Object.entries(stats.fileTypes);
    return types.reduce(
      (max, [type, count]) => (count > max.count ? { type: type as LogFileType, count } : max),
      { type: 'system' as LogFileType, count: 0 }
    );
  };

  const maxType = getMaxFileType();

  return (
    <div className={styles.logStatsContainer}>
      {/* 总体统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card className={styles.statCard}>
            <Statistic
              title='总文件数'
              value={stats.totalFiles}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.statCard}>
            <Statistic
              title='总大小'
              value={formatFileSize(stats.totalSize)}
              prefix={<BarChartOutlined style={{ color: '#52c41a' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.statCard}>
            <Statistic
              title='主要类型'
              value={getFileTypeConfig(maxType.type).text}
              prefix={getFileTypeConfig(maxType.type).icon}
              valueStyle={{ color: getFileTypeConfig(maxType.type).color }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 文件类型分布 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                文件类型分布
              </Space>
            }
            className={styles.distributionCard}
          >
            <div className={styles.typeDistribution}>
              {Object.entries(stats.fileTypes).map(([type, count]) => {
                const config = getFileTypeConfig(type as LogFileType);
                const percentage = getTypePercentage(count);

                return (
                  <div key={type} className={styles.typeItem}>
                    <div className={styles.typeHeader}>
                      <Space>
                        <span style={{ color: config.color }}>{config.icon}</span>
                        <Text strong>{config.text}</Text>
                        <Tag color={config.color}>{count}</Tag>
                      </Space>
                      <Text type='secondary'>{percentage}%</Text>
                    </div>
                    <Progress
                      percent={percentage}
                      strokeColor={config.color}
                      showInfo={false}
                      size='small'
                    />
                    <Text type='secondary' style={{ fontSize: 12 }}>
                      {config.description}
                    </Text>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* 最近日志文件 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                最近日志文件
              </Space>
            }
            className={styles.recentCard}
          >
            <List
              size='small'
              dataSource={stats.recentLogs}
              loading={loading}
              renderItem={item => (
                <List.Item className={styles.recentItem}>
                  <div className={styles.recentContent}>
                    <div className={styles.recentHeader}>
                      <Text strong ellipsis style={{ maxWidth: 200 }}>
                        {item.name}
                      </Text>
                      <Text type='secondary' style={{ fontSize: 12 }}>
                        {formatFileSize(item.size)}
                      </Text>
                    </div>
                    <Text type='secondary' style={{ fontSize: 12 }}>
                      {formatDateTime(item.modified)}
                    </Text>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: '暂无最近日志文件' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 健康状态指示器 */}
      <Card
        title={
          <Space>
            <ExclamationCircleOutlined />
            系统健康状态
          </Space>
        }
        style={{ marginTop: 16 }}
        className={styles.healthCard}
      >
        <Row gutter={16}>
          <Col span={6}>
            <div className={styles.healthItem}>
              <div className={styles.healthValue}>
                {stats.fileTypes.error === 0 ? '良好' : '警告'}
              </div>
              <div className={styles.healthLabel}>错误日志状态</div>
              <div
                className={`${styles.healthIndicator} ${
                  stats.fileTypes.error === 0 ? styles.good : styles.warning
                }`}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.healthItem}>
              <div className={styles.healthValue}>
                {stats.totalSize < 100 * 1024 * 1024 ? '正常' : '注意'}
              </div>
              <div className={styles.healthLabel}>存储使用</div>
              <div
                className={`${styles.healthIndicator} ${
                  stats.totalSize < 100 * 1024 * 1024 ? styles.good : styles.warning
                }`}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.healthItem}>
              <div className={styles.healthValue}>{stats.totalFiles < 50 ? '正常' : '较多'}</div>
              <div className={styles.healthLabel}>文件数量</div>
              <div
                className={`${styles.healthIndicator} ${
                  stats.totalFiles < 50 ? styles.good : styles.info
                }`}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.healthItem}>
              <div className={styles.healthValue}>活跃</div>
              <div className={styles.healthLabel}>日志系统</div>
              <div className={`${styles.healthIndicator} ${styles.good}`} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default LogStats;
