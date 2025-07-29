import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Button,
  Space,
  Select,
  Tag,
  Tooltip,
  Alert,
  Divider,
  Typography,
  message,
} from 'antd';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Line, Column, Gauge } from '@ant-design/plots';
import { request } from '@/utils/request';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text, Title } = Typography;

interface RealtimeData {
  timestamp: string;
  system: {
    cpu: {
      count: number;
      model: string;
      usage: number;
      loadAverage: number[];
    };
    memory: {
      total: number;
      free: number;
      used: number;
      usage: string;
    };
    uptime: number;
    platform: string;
    arch: string;
    hostname: string;
  };
  process: {
    pid: number;
    uptime: number;
    memory: any;
    cpu: any;
    version: string;
    env: string;
  };
  performance: {
    responseTime: any;
    cache: any;
  };
  health: {
    status: string;
    checks: any;
  };
}

interface ApiStats {
  routes: Array<{
    route: string;
    totalRequests: number;
    avgResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
  }>;
  summary: {
    totalRoutes: number;
    totalRequests: number;
    avgResponseTime: number;
  };
}

const PerformancePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 获取实时数据
  const fetchRealtimeData = async () => {
    try {
      const response = await request.get('/api/performance/realtime');
      if (response.code === 200) {
        setRealtimeData(response.data);
      }
    } catch (error) {
      message.error('获取实时数据失败');
    }
  };

  // 获取API统计
  const fetchApiStats = async () => {
    try {
      const response = await request.get('/api/performance/api-stats');
      if (response.code === 200) {
        setApiStats(response.data);
      }
    } catch (error) {
      message.error('获取API统计失败');
    }
  };

  // 获取历史数据
  const fetchHistoryData = async (hours = 24) => {
    try {
      const response = await request.get('/api/performance/history', {
        params: { hours },
      });
      if (response.code === 200) {
        setHistoryData(response.data.data);
      }
    } catch (error) {
      message.error('获取历史数据失败');
    }
  };

  // 获取趋势数据
  const fetchTrends = async (period = '1h') => {
    try {
      const response = await request.get('/api/performance/trends', {
        params: { period },
      });
      if (response.code === 200) {
        setTrends(response.data.data);
      }
    } catch (error) {
      message.error('获取趋势数据失败');
    }
  };

  // 重置统计数据
  const resetStats = async (type: string) => {
    try {
      const response = await request.post('/api/performance/reset', { type });
      if (response.code === 200) {
        message.success(response.message);
        fetchApiStats();
        fetchRealtimeData();
      }
    } catch (error) {
      message.error('重置统计数据失败');
    }
  };

  // 刷新所有数据
  const refreshAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRealtimeData(),
        fetchApiStats(),
        fetchHistoryData(),
        fetchTrends(selectedPeriod),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [selectedPeriod]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRealtimeData();
    }, 30000); // 30秒刷新一次

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // 格式化字节数
  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = bytes;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  // 格式化运行时间
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  // API统计表格列
  const apiColumns = [
    {
      title: '路由',
      dataIndex: 'route',
      key: 'route',
      render: (route: string) => <Text code>{route}</Text>,
    },
    {
      title: '请求次数',
      dataIndex: 'totalRequests',
      key: 'totalRequests',
      sorter: (a: any, b: any) => a.totalRequests - b.totalRequests,
    },
    {
      title: '平均响应时间',
      dataIndex: 'avgResponseTime',
      key: 'avgResponseTime',
      render: (time: number) => `${time.toFixed(2)}ms`,
      sorter: (a: any, b: any) => a.avgResponseTime - b.avgResponseTime,
    },
    {
      title: '最小响应时间',
      dataIndex: 'minResponseTime',
      key: 'minResponseTime',
      render: (time: number) => `${time.toFixed(2)}ms`,
    },
    {
      title: '最大响应时间',
      dataIndex: 'maxResponseTime',
      key: 'maxResponseTime',
      render: (time: number) => `${time.toFixed(2)}ms`,
    },
    {
      title: '性能状态',
      key: 'status',
      render: (_: any, record: any) => {
        const avgTime = record.avgResponseTime;
        if (avgTime < 100) {
          return (
            <Tag color='green' icon={<CheckCircleOutlined />}>
              优秀
            </Tag>
          );
        } else if (avgTime < 500) {
          return (
            <Tag color='orange' icon={<ClockCircleOutlined />}>
              良好
            </Tag>
          );
        } else {
          return (
            <Tag color='red' icon={<WarningOutlined />}>
              需优化
            </Tag>
          );
        }
      },
    },
  ];

  // 趋势图配置
  const trendConfig = {
    data: trends,
    xField: 'timestamp',
    yField: 'cpu',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    xAxis: {
      type: 'time',
      tickCount: 10,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: 'CPU使用率',
          value: `${datum.cpu.toFixed(2)}%`,
        };
      },
    },
  };

  return (
    <PageContainer
      title='性能监控'
      extra={[
        <Select
          key='period'
          value={selectedPeriod}
          onChange={setSelectedPeriod}
          style={{ width: 120 }}
        >
          <Option value='1h'>1小时</Option>
          <Option value='6h'>6小时</Option>
          <Option value='24h'>24小时</Option>
        </Select>,
        <Button
          key='auto-refresh'
          type={autoRefresh ? 'primary' : 'default'}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          {autoRefresh ? '停止自动刷新' : '开启自动刷新'}
        </Button>,
        <Button key='refresh' icon={<ReloadOutlined />} onClick={refreshAllData} loading={loading}>
          刷新
        </Button>,
      ]}
    >
      {realtimeData && (
        <>
          {/* 系统健康状态 */}
          <Alert
            message={`系统状态: ${realtimeData.health.status}`}
            type={realtimeData.health.status === 'healthy' ? 'success' : 'warning'}
            showIcon
            style={{ marginBottom: 16 }}
          />

          {/* 实时监控卡片 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title='CPU使用率'
                  value={realtimeData.system.cpu.usage}
                  precision={2}
                  suffix='%'
                  prefix={<DashboardOutlined />}
                />
                <Progress
                  percent={realtimeData.system.cpu.usage}
                  status={realtimeData.system.cpu.usage > 80 ? 'exception' : 'normal'}
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='内存使用率'
                  value={parseFloat(realtimeData.system.memory.usage)}
                  precision={2}
                  suffix='%'
                  prefix={<DatabaseOutlined />}
                />
                <Progress
                  percent={parseFloat(realtimeData.system.memory.usage)}
                  status={
                    parseFloat(realtimeData.system.memory.usage) > 80 ? 'exception' : 'normal'
                  }
                  showInfo={false}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='系统运行时间'
                  value={formatUptime(realtimeData.system.uptime)}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='进程内存'
                  value={formatBytes(realtimeData.process.memory.rss)}
                  prefix={<ThunderboltOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* 系统信息 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card title='系统信息' size='small'>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>主机名:</Text> {realtimeData.system.hostname}
                  </Col>
                  <Col span={12}>
                    <Text strong>平台:</Text> {realtimeData.system.platform}
                  </Col>
                  <Col span={12}>
                    <Text strong>架构:</Text> {realtimeData.system.arch}
                  </Col>
                  <Col span={12}>
                    <Text strong>CPU核心:</Text> {realtimeData.system.cpu.count}
                  </Col>
                </Row>
                <Divider />
                <Text strong>CPU型号:</Text>
                <br />
                <Text type='secondary'>{realtimeData.system.cpu.model}</Text>
              </Card>
            </Col>
            <Col span={12}>
              <Card title='进程信息' size='small'>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>进程ID:</Text> {realtimeData.process.pid}
                  </Col>
                  <Col span={12}>
                    <Text strong>Node版本:</Text> {realtimeData.process.version}
                  </Col>
                  <Col span={12}>
                    <Text strong>环境:</Text> {realtimeData.process.env}
                  </Col>
                  <Col span={12}>
                    <Text strong>运行时间:</Text> {formatUptime(realtimeData.process.uptime)}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* 性能趋势图 */}
      <Card title='CPU使用率趋势' style={{ marginBottom: 16 }}>
        {trends.length > 0 && <Line {...trendConfig} />}
      </Card>

      {/* API性能统计 */}
      {apiStats && (
        <Card
          title='API性能统计'
          extra={
            <Space>
              <Button size='small' onClick={() => resetStats('response')}>
                重置响应时间统计
              </Button>
              <Button size='small' onClick={() => resetStats('all')}>
                重置所有统计
              </Button>
            </Space>
          }
        >
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Statistic
                title='总路由数'
                value={apiStats.summary.totalRoutes}
                prefix={<ApiOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic title='总请求数' value={apiStats.summary.totalRequests} />
            </Col>
            <Col span={8}>
              <Statistic
                title='平均响应时间'
                value={apiStats.summary.avgResponseTime}
                precision={2}
                suffix='ms'
              />
            </Col>
          </Row>

          <Table
            columns={apiColumns}
            dataSource={apiStats.routes}
            rowKey='route'
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 个路由`,
            }}
          />
        </Card>
      )}
    </PageContainer>
  );
};

export default PerformancePage;
