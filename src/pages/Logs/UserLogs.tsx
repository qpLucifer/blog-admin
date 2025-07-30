import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  message,
  Modal,
  Tooltip,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  SearchOutlined,
  BarChartOutlined,
  UserOutlined,
  LoginOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import { getUserLogs, getLogStats, cleanLogFiles, exportLogFiles } from '../../api/logs';
import {
  UserLog,
  UserLogQueryParams,
  LogStats,
  UserLogAction,
  UserLogModule,
  UserLogStatus,
} from '../../types';
import { useApi, useInitialEffect } from '../../hooks';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

// 操作类型配置
const actionConfigs = {
  login: { label: '登录', color: 'blue', icon: <LoginOutlined /> },
  logout: { label: '登出', color: 'default', icon: <LoginOutlined /> },
  create: { label: '创建', color: 'green', icon: <FileTextOutlined /> },
  update: { label: '更新', color: 'orange', icon: <FileTextOutlined /> },
  delete: { label: '删除', color: 'red', icon: <DeleteOutlined /> },
  view: { label: '查看', color: 'cyan', icon: <FileTextOutlined /> },
};

// 模块类型配置
const moduleConfigs = {
  auth: { label: '认证', color: 'blue' },
  user: { label: '用户管理', color: 'green' },
  blog: { label: '博客管理', color: 'purple' },
  comment: { label: '评论管理', color: 'orange' },
  tag: { label: '标签管理', color: 'cyan' },
  role: { label: '角色管理', color: 'magenta' },
  menu: { label: '菜单管理', color: 'lime' },
  daySentence: { label: '每日一句', color: 'gold' },
  upload: { label: '文件上传', color: 'volcano' },
};

// 状态配置
const statusConfigs = {
  success: { label: '成功', color: 'success' },
  failed: { label: '失败', color: 'error' },
  error: { label: '错误', color: 'warning' },
};

const UserLogs: React.FC = () => {
  const [queryParams, setQueryParams] = useState<UserLogQueryParams>({
    pageSize: 20,
    currentPage: 1,
  });

  // API hooks
  const { data: logsData, loading: logsLoading, execute: fetchLogs } = useApi(getUserLogs);

  const {
    data: statsData,
    loading: statsLoading,
    execute: fetchStats,
  } = useApi<LogStats>(getLogStats);

  const { loading: cleanLoading, execute: executeClean } = useApi(cleanLogFiles);
  const { loading: exportLoading, execute: executeExport } = useApi(exportLogFiles);

  // 初始化数据
  useInitialEffect(() => {
    fetchLogs(queryParams);
    fetchStats();
  });

  // 搜索处理
  const handleSearch = () => {
    setQueryParams(prev => ({ ...prev, currentPage: 1 }));
    fetchLogs({ ...queryParams, currentPage: 1 });
  };

  // 重置搜索
  const handleReset = () => {
    const resetParams = { pageSize: 20, currentPage: 1 };
    setQueryParams(resetParams);
    fetchLogs(resetParams);
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchLogs(queryParams);
    fetchStats();
  };

  // 清理日志
  const handleClean = () => {
    confirm({
      title: '确认清理日志',
      icon: <ExclamationCircleOutlined />,
      content: '确定要清理30天前的日志记录吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const result = await executeClean({ days: 30 });
          if (result?.data) {
            message.success(`成功清理了 ${result.data.deletedCount} 条日志记录`);
            handleRefresh();
          }
        } catch (error) {
          message.error('清理日志失败');
        }
      },
    });
  };

  // 导出日志
  const handleExport = async () => {
    try {
      const result = await executeExport(queryParams);
      if (result) {
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `logs_${dayjs().format('YYYY-MM-DD')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success('日志导出成功');
      }
    } catch (error) {
      message.error('导出日志失败');
    }
  };

  // 表格列定义
  const columns: ColumnsType<UserLog> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: '用户',
      dataIndex: 'username',
      width: 120,
      render: (username, record) => (
        <Space>
          <UserOutlined />
          {username || `用户${record.user_id || '未知'}`}
        </Space>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (action: UserLogAction) => {
        const config = actionConfigs[action];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '模块',
      dataIndex: 'module',
      width: 120,
      render: (module: UserLogModule) => {
        const config = moduleConfigs[module];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '目标',
      dataIndex: 'target_name',
      width: 200,
      ellipsis: true,
      render: text => text || '-',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      width: 140,
      render: ip => ip || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: UserLogStatus) => {
        const config = statusConfigs[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      width: 180,
      render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
    },
    {
      title: '详情',
      dataIndex: 'details',
      width: 100,
      render: details => {
        if (!details || details === '{}') return '-';
        return (
          <Tooltip title={<pre>{JSON.stringify(JSON.parse(details), null, 2)}</pre>}>
            <Button type='link' size='small'>
              查看详情
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div className={`${styles.root} ${pageStyles.pageContainer}`}>
      <div className={pageStyles.pageContent}>
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title='今日操作'
                value={statsData?.todayCount}
                prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                loading={statsLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='近7天操作'
                value={statsData?.recentCount}
                prefix={<BarChartOutlined style={{ color: '#52c41a' }} />}
                loading={statsLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='主要模块'
                value={statsData?.moduleStats[0]?.module || '-'}
                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                loading={statsLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='主要操作'
                value={
                  statsData?.actionStats[0]?.action
                    ? actionConfigs[statsData.actionStats[0]?.action as UserLogAction]?.label
                    : '-'
                }
                prefix={<LoginOutlined style={{ color: '#fa8c16' }} />}
                loading={statsLoading}
              />
            </Card>
          </Col>
        </Row>

        {/* 搜索表单 */}
        <Card className={pageStyles.searchCard} style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder='用户名'
                value={queryParams.username}
                onChange={e => setQueryParams(prev => ({ ...prev, username: e.target.value }))}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder='操作类型'
                value={queryParams.action}
                onChange={value => setQueryParams(prev => ({ ...prev, action: value }))}
                allowClear
              >
                {Object.entries(actionConfigs).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder='模块'
                value={queryParams.module}
                onChange={value => setQueryParams(prev => ({ ...prev, module: value }))}
                allowClear
              >
                {Object.entries(moduleConfigs).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                value={
                  queryParams.start_date && queryParams.end_date
                    ? [dayjs(queryParams.start_date), dayjs(queryParams.end_date)]
                    : null
                }
                onChange={dates => {
                  if (dates) {
                    setQueryParams(prev => ({
                      ...prev,
                      start_date: dates[0]?.format('YYYY-MM-DD'),
                      end_date: dates[1]?.format('YYYY-MM-DD'),
                    }));
                  } else {
                    setQueryParams(prev => ({
                      ...prev,
                      start_date: undefined,
                      end_date: undefined,
                    }));
                  }
                }}
              />
            </Col>
            <Col span={4}>
              <Space>
                <Button type='primary' icon={<SearchOutlined />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 操作按钮 */}
        <Card style={{ marginBottom: 16 }}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={logsLoading}>
              刷新
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport} loading={exportLoading}>
              导出
            </Button>
            <Button icon={<DeleteOutlined />} danger onClick={handleClean} loading={cleanLoading}>
              清理日志
            </Button>
          </Space>
        </Card>

        {/* 日志表格 */}
        <Card>
          <Table
            columns={columns}
            dataSource={logsData?.list || []}
            rowKey='id'
            loading={logsLoading}
            pagination={{
              current: queryParams.currentPage,
              pageSize: queryParams.pageSize,
              total: logsData?.data?.total || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              onChange: (page, size) => {
                const newParams = { ...queryParams, currentPage: page, pageSize: size };
                setQueryParams(newParams);
                fetchLogs(newParams);
              },
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default UserLogs;
