import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  Select,
  DatePicker,
  message,
  Statistic,
  Row,
  Col,
  Tooltip,
  Drawer,
  Typography,
  Divider,
  Popconfirm,
} from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  FilterOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { request } from '@/utils/request';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;

interface LogFile {
  name: string;
  size: number;
  modified: string;
  type: 'error' | 'auth' | 'business' | 'system';
}

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  meta: any;
  raw: string;
}

interface LogStats {
  totalFiles: number;
  totalSize: number;
  fileTypes: {
    error: number;
    auth: number;
    business: number;
    system: number;
  };
  recentLogs: LogFile[];
}

const LogsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [logStats, setLogStats] = useState<LogStats | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [logContent, setLogContent] = useState<LogEntry[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });

  // 获取日志文件列表
  const fetchLogFiles = async () => {
    setLoading(true);
    try {
      const response = await request.get('/api/logs/files');
      if (response.code === 200) {
        setLogFiles(response.data);
      }
    } catch (error) {
      message.error('获取日志文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取日志统计
  const fetchLogStats = async () => {
    try {
      const response = await request.get('/api/logs/stats');
      if (response.code === 200) {
        setLogStats(response.data);
      }
    } catch (error) {
      message.error('获取日志统计失败');
    }
  };

  // 获取日志内容
  const fetchLogContent = async (filename: string, page = 1) => {
    setContentLoading(true);
    try {
      const params = {
        page,
        pageSize: pagination.pageSize,
        ...(levelFilter && { level: levelFilter }),
        ...(searchText && { search: searchText }),
      };

      const response = await request.get(`/api/logs/content/${filename}`, { params });
      if (response.code === 200) {
        setLogContent(response.data.list);
        setPagination(prev => ({
          ...prev,
          current: response.data.page,
          total: response.data.total,
        }));
      }
    } catch (error) {
      message.error('获取日志内容失败');
    } finally {
      setContentLoading(false);
    }
  };

  // 下载日志文件
  const downloadLogFile = async (filename: string) => {
    try {
      const response = await fetch(`/api/logs/download/${filename}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        message.success('下载成功');
      } else {
        message.error('下载失败');
      }
    } catch (error) {
      message.error('下载失败');
    }
  };

  // 清理日志文件
  const cleanLogFiles = async (days: number) => {
    try {
      const response = await request.delete('/api/logs/clean', {
        data: { days },
      });
      if (response.code === 200) {
        message.success(`清理了 ${response.data.deletedCount} 个过期日志文件`);
        fetchLogFiles();
        fetchLogStats();
      }
    } catch (error) {
      message.error('清理日志文件失败');
    }
  };

  // 查看日志内容
  const viewLogContent = (filename: string) => {
    setSelectedFile(filename);
    setDrawerVisible(true);
    fetchLogContent(filename);
  };

  useEffect(() => {
    fetchLogFiles();
    fetchLogStats();
  }, []);

  // 日志文件表格列
  const fileColumns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <FileTextOutlined />
          <Text code>{name}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          error: 'red',
          auth: 'blue',
          business: 'green',
          system: 'orange',
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>;
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let unitIndex = 0;
        let fileSize = size;

        while (fileSize >= 1024 && unitIndex < units.length - 1) {
          fileSize /= 1024;
          unitIndex++;
        }

        return `${fileSize.toFixed(2)} ${units[unitIndex]}`;
      },
    },
    {
      title: '修改时间',
      dataIndex: 'modified',
      key: 'modified',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: LogFile) => (
        <Space>
          <Tooltip title='查看内容'>
            <Button
              type='text'
              icon={<EyeOutlined />}
              onClick={() => viewLogContent(record.name)}
            />
          </Tooltip>
          <Tooltip title='下载文件'>
            <Button
              type='text'
              icon={<DownloadOutlined />}
              onClick={() => downloadLogFile(record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 日志内容表格列
  const contentColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (time: string) => dayjs(time).format('MM-DD HH:mm:ss'),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => {
        const colors = {
          error: 'red',
          warn: 'orange',
          info: 'blue',
          debug: 'gray',
        };
        return <Tag color={colors[level as keyof typeof colors]}>{level}</Tag>;
      },
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (message: string) => (
        <Tooltip title={message}>
          <Text>{message}</Text>
        </Tooltip>
      ),
    },
  ];

  return (
    <PageContainer
      title='日志管理'
      extra={[
        <Button
          key='refresh'
          icon={<ReloadOutlined />}
          onClick={() => {
            fetchLogFiles();
            fetchLogStats();
          }}
        >
          刷新
        </Button>,
        <Popconfirm
          key='clean'
          title='确定要清理7天前的日志文件吗？'
          onConfirm={() => cleanLogFiles(7)}
        >
          <Button icon={<DeleteOutlined />} danger>
            清理日志
          </Button>
        </Popconfirm>,
      ]}
    >
      {/* 统计卡片 */}
      {logStats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title='总文件数'
                value={logStats.totalFiles}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='总大小'
                value={(logStats.totalSize / 1024 / 1024).toFixed(2)}
                suffix='MB'
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='错误日志'
                value={logStats.fileTypes.error}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='认证日志'
                value={logStats.fileTypes.auth}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 日志文件列表 */}
      <Card title='日志文件列表'>
        <Table
          columns={fileColumns}
          dataSource={logFiles}
          rowKey='name'
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 个文件`,
          }}
        />
      </Card>

      {/* 日志内容抽屉 */}
      <Drawer
        title={`日志内容 - ${selectedFile}`}
        width='80%'
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={
          <Space>
            <Search
              placeholder='搜索日志内容'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={() => fetchLogContent(selectedFile, 1)}
              style={{ width: 200 }}
            />
            <Select
              placeholder='选择日志级别'
              value={levelFilter}
              onChange={setLevelFilter}
              allowClear
              style={{ width: 120 }}
            >
              <Option value='error'>Error</Option>
              <Option value='warn'>Warn</Option>
              <Option value='info'>Info</Option>
              <Option value='debug'>Debug</Option>
            </Select>
            <Button icon={<FilterOutlined />} onClick={() => fetchLogContent(selectedFile, 1)}>
              筛选
            </Button>
          </Space>
        }
      >
        <Table
          columns={contentColumns}
          dataSource={logContent}
          rowKey='id'
          loading={contentLoading}
          pagination={{
            ...pagination,
            onChange: page => fetchLogContent(selectedFile, page),
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条日志`,
          }}
          expandable={{
            expandedRowRender: record => (
              <div style={{ margin: 0 }}>
                <Paragraph>
                  <Text strong>原始日志：</Text>
                </Paragraph>
                <Paragraph>
                  <Text code style={{ whiteSpace: 'pre-wrap' }}>
                    {record.raw}
                  </Text>
                </Paragraph>
                {Object.keys(record.meta).length > 0 && (
                  <>
                    <Divider />
                    <Paragraph>
                      <Text strong>元数据：</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text code>{JSON.stringify(record.meta, null, 2)}</Text>
                    </Paragraph>
                  </>
                )}
              </div>
            ),
          }}
        />
      </Drawer>
    </PageContainer>
  );
};

export default LogsPage;
