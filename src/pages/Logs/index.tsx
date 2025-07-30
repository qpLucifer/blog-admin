import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Tooltip,
  message,
  Modal,
  Drawer,
  Typography,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import {
  getLogFiles,
  getLogContent,
  downloadLogFile,
  cleanLogFiles,
  getLogStats,
} from '../../api/logs';
import {
  LogFile,
  LogEntry,
  LogStats as LogStatsType,
  LogQueryParams,
  LogFileType,
  LogContentResponse,
} from '../../types';
import { useApi, useInitialEffect } from '../../hooks';
import { useMenuPermission } from '../../hooks/useMenuPermission';
import { formatDateTime } from '../../utils/dateUtils';
import { formatFileSize } from '../../utils/tableUtils';
import LogViewer from '../../components/common/LogViewer';
import LogStats from '../../components/common/LogStats';

const { Search } = Input;
const { Title, Text } = Typography;
const { confirm } = Modal;

const Logs: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<LogFile | null>(null);
  const [logContent, setLogContent] = useState<LogEntry[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [cleanModalVisible, setCleanModalVisible] = useState(false);
  const [cleanDays, setCleanDays] = useState(7);

  // 查询参数
  const [queryParams, setQueryParams] = useState<LogQueryParams>({
    page: 1,
    pageSize: 100,
    level: undefined,
    search: '',
  });

  const { hasPermission } = useMenuPermission();

  // 获取日志文件列表
  const {
    data: logFiles,
    loading: filesLoading,
    execute: fetchLogFiles,
  } = useApi<LogFile[]>(getLogFiles, { showError: true });

  // 获取日志统计信息
  const {
    data: logStats,
    loading: statsLoading,
    execute: fetchLogStats,
  } = useApi<LogStatsType>(getLogStats, { showError: true });

  useInitialEffect(() => {
    fetchLogFiles();
    fetchLogStats();
  }, []);

  // 获取文件类型图标和颜色
  const getFileTypeConfig = (type: LogFileType) => {
    const configs = {
      error: { color: 'red', text: '错误日志' },
      auth: { color: 'blue', text: '认证日志' },
      business: { color: 'green', text: '业务日志' },
      system: { color: 'purple', text: '系统日志' },
      api: { color: 'orange', text: 'API日志' },
      security: { color: 'volcano', text: '安全日志' },
      database: { color: 'cyan', text: '数据库日志' },
    };
    return configs[type] || configs.system;
  };

  // 文件列表列定义
  const fileColumns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <FileTextOutlined />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: LogFileType) => {
        const config = getFileTypeConfig(type);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '修改时间',
      dataIndex: 'modified',
      key: 'modified',
      render: (modified: string) => formatDateTime(modified),
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
              onClick={() => handleViewFile(record)}
              disabled={!hasPermission('read')}
            />
          </Tooltip>
          <Tooltip title='下载文件'>
            <Button
              type='text'
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadFile(record)}
              disabled={!hasPermission('read')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 查看文件内容
  const handleViewFile = async (file: LogFile) => {
    setSelectedFile(file);
    setContentLoading(true);
    setViewerVisible(true);

    try {
      const data = (await getLogContent(
        file.type,
        file.name,
        queryParams
      )) as unknown as LogContentResponse;
      setLogContent(data.list || []);
    } catch (error) {
      message.error('获取日志内容失败');
    } finally {
      setContentLoading(false);
    }
  };

  // 下载文件
  const handleDownloadFile = async (file: LogFile) => {
    try {
      const blob = (await downloadLogFile(file.type, file.name)) as any;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('文件下载成功');
    } catch (error) {
      message.error('文件下载失败');
    }
  };

  // 清理日志文件
  const handleCleanLogs = () => {
    confirm({
      title: '确认清理日志',
      content: `确定要清理 ${cleanDays} 天前的日志文件吗？此操作不可恢复。`,
      icon: <ExclamationCircleOutlined />,
      okText: '确认清理',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = (await cleanLogFiles({ days: cleanDays })) as any;
          message.success(`成功清理了 ${result.deletedCount || 0} 个日志文件`);
          fetchLogFiles();
          fetchLogStats();
          setCleanModalVisible(false);
        } catch (error) {
          message.error('清理日志文件失败');
        }
      },
    });
  };

  return (
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.pageHeader}>
        <Title level={2}>日志管理</Title>
        <Text type='secondary'>查看和管理系统日志文件</Text>
      </div>

      {/* 统计信息组件 */}
      {logStats && <LogStats stats={logStats} loading={statsLoading} />}

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: 16 }} className={styles.toolbarCard}>
        <Space wrap>
          <Button
            type='primary'
            icon={<ReloadOutlined />}
            onClick={() => {
              fetchLogFiles();
              fetchLogStats();
            }}
            loading={filesLoading}
            className={styles.primaryButton}
          >
            刷新
          </Button>
          <Button icon={<BarChartOutlined />} onClick={() => setStatsVisible(true)}>
            详细统计
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => setCleanModalVisible(true)}
            disabled={!hasPermission('delete')}
          >
            清理日志
          </Button>
          <Search placeholder='搜索日志文件...' style={{ width: 300 }} allowClear />
        </Space>
      </Card>

      {/* 文件列表 */}
      <Card title='日志文件列表' className={styles.fileListCard}>
        <Table
          columns={fileColumns}
          dataSource={logFiles || []}
          loading={filesLoading}
          rowKey='name'
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 个文件`,
          }}
          className={styles.logTable}
        />
      </Card>

      {/* 日志查看器抽屉 */}
      <Drawer
        title={`日志查看器 - ${selectedFile?.name || ''}`}
        placement='right'
        size='large'
        open={viewerVisible}
        onClose={() => setViewerVisible(false)}
        className={styles.logDrawer}
      >
        {selectedFile && (
          <LogViewer
            logs={logContent}
            loading={contentLoading}
            filename={selectedFile.name}
            onSearch={keyword => {
              setQueryParams(prev => ({ ...prev, search: keyword }));
              handleViewFile(selectedFile);
            }}
            onLevelFilter={_levels => {
              // 这里可以实现级别过滤逻辑
            }}
            onRefresh={() => handleViewFile(selectedFile)}
            onDownload={() => handleDownloadFile(selectedFile)}
          />
        )}
      </Drawer>

      {/* 统计信息模态框 */}
      <Modal
        title='详细统计信息'
        open={statsVisible}
        onCancel={() => setStatsVisible(false)}
        footer={null}
        width={800}
        className={styles.statsModal}
      >
        {logStats && <LogStats stats={logStats} loading={statsLoading} />}
      </Modal>

      {/* 清理日志模态框 */}
      <Modal
        title='清理日志文件'
        open={cleanModalVisible}
        onCancel={() => setCleanModalVisible(false)}
        onOk={handleCleanLogs}
        okText='确认清理'
        okType='danger'
        cancelText='取消'
        className={styles.cleanModal}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <Text>选择要清理的日志文件保留天数：</Text>
          <Input
            type='number'
            value={cleanDays}
            onChange={e => setCleanDays(Number(e.target.value))}
            addonAfter='天'
            min={1}
            max={365}
          />
          <Text type='warning'>⚠️ 此操作将删除 {cleanDays} 天前的所有日志文件，且不可恢复！</Text>
        </Space>
      </Modal>
    </div>
  );
};

export default Logs;
