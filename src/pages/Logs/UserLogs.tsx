import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Form,
  message,
  Modal,
  Drawer,
  Descriptions,
  Typography,
  Divider,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
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
import { SearchCard, TableContainer, CommonTable } from '../../components';
import {
  getUserLogs,
  getLogStats,
  cleanLogFiles,
  exportLogFiles,
  markLogAsRead as markLogAsReadAPI,
} from '../../api/logs';
import {
  UserLog,
  UserLogQueryParams,
  LogStats,
  UserLogAction,
  UserLogModule,
  UserLogType,
  UserLogStatus,
  TableColumn,
  ListResponse,
} from '../../types';
import { useApi, useInitialEffect } from '../../hooks';

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
  error: { label: '错误', color: 'volcano', icon: <ExclamationCircleOutlined /> },
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
  logs: { label: '日志管理', color: 'geekblue' },
};

// 日志类型配置
const logTypeConfigs = {
  operation: { label: '操作日志', color: 'blue' },
  security: { label: '安全日志', color: 'red' },
  system: { label: '系统日志', color: 'green' },
  error: { label: '错误日志', color: 'volcano' },
};

// 状态配置
const statusConfigs = {
  success: { label: '成功', color: 'success' },
  failed: { label: '失败', color: 'error' },
  error: { label: '错误', color: 'warning' },
};

const UserLogs: React.FC = () => {
  const [form] = Form.useForm();
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [queryParams, setQueryParams] = useState<UserLogQueryParams>({
    pageSize: 10,
    currentPage: 1,
  });

  // API hooks
  const {
    data: logsData,
    loading: logsLoading,
    execute: fetchLogs,
  } = useApi<ListResponse<UserLog>>(getUserLogs);

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
  const onFinish = (values: any) => {
    const searchParams = {
      ...values,
      start_date: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      end_date: values.dateRange?.[1]?.format('YYYY-MM-DD'),
      pageSize: 20,
      currentPage: 1,
    };
    delete searchParams.dateRange;
    setQueryParams(searchParams);
    fetchLogs(searchParams);
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

  // 打开日志详情抽屉
  const handleViewLogDetail = (log: UserLog) => {
    setSelectedLog(log);
    setDrawerVisible(true);
  };

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedLog(null);
  };

  // 标记日志为已读
  const handleMarkLogAsRead = async () => {
    if (!selectedLog) return;

    try {
      await markLogAsReadAPI(selectedLog.id);
      message.success('日志已标记为已读');

      handleCloseDrawer();
      handleRefresh();
    } catch (error) {
      message.error('标记日志失败');
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
      title: '日志类型',
      dataIndex: 'log_type',
      width: 100,
      render: (logType: UserLogType) => {
        const config = logTypeConfigs[logType];
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
      title: '已读',
      dataIndex: 'hasRead',
      width: 80,
      render: (hasRead: boolean) => (
        <Tag color={hasRead ? 'green' : 'red'}>{hasRead ? '是' : '否'}</Tag>
      ),
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
      render: (_, record) => (
        <Button type='link' size='small' onClick={() => handleViewLogDetail(record)}>
          查看详情
        </Button>
      ),
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

        {/* 搜索区域 */}
        <SearchCard
          title='查询条件'
          form={form}
          onFinish={onFinish}
          onReset={handleReset}
          loading={logsLoading}
          collapsed={searchCollapsed}
          onToggleCollapse={() => setSearchCollapsed(!searchCollapsed)}
        >
          <Form.Item name='username' label='用户名'>
            <Input allowClear placeholder='输入用户名' style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name='action' label='操作类型'>
            <Select allowClear placeholder='选择操作类型' style={{ width: 120 }}>
              {Object.entries(actionConfigs).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='module' label='模块'>
            <Select allowClear placeholder='选择模块' style={{ width: 110 }}>
              {Object.entries(moduleConfigs).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='log_type' label='日志类型'>
            <Select allowClear placeholder='选择日志类型' style={{ width: 120 }}>
              {Object.entries(logTypeConfigs).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='dateRange' label='时间范围'>
            <DatePicker.RangePicker allowClear style={{ width: 300, height: 38 }} />
          </Form.Item>
        </SearchCard>

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

        {/* 表格区域 */}
        <TableContainer loading={logsLoading}>
          <CommonTable
            columns={columns as TableColumn[]}
            dataSource={logsData?.list || []}
            rowKey='id'
            pagination={{
              current: queryParams.currentPage,
              pageSize: queryParams.pageSize,
              total: logsData?.total || 0,
              onChange: (page, size) => {
                const newParams = { ...queryParams, currentPage: page, pageSize: size };
                setQueryParams(newParams);
                fetchLogs(newParams);
              },
            }}
            loading={logsLoading}
            scroll={{ x: 1200 }}
          />
        </TableContainer>

        {/* 日志详情抽屉 */}
        <Drawer
          title='日志详情'
          placement='right'
          width={600}
          open={drawerVisible}
          onClose={handleCloseDrawer}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCloseDrawer}>返回</Button>
                {selectedLog && !selectedLog.hasRead && (
                  <Button type='primary' onClick={handleMarkLogAsRead}>
                    标记已读
                  </Button>
                )}
              </Space>
            </div>
          }
        >
          {selectedLog && (
            <div>
              <Descriptions title='基本信息' bordered column={1} size='small'>
                <Descriptions.Item label='日志ID'>{selectedLog.id}</Descriptions.Item>
                <Descriptions.Item label='用户'>
                  <Space>
                    <UserOutlined />
                    {selectedLog.username || '匿名用户'}
                    {selectedLog.user_id && <Tag color='blue'>ID: {selectedLog.user_id}</Tag>}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='操作类型'>
                  <Tag color={actionConfigs[selectedLog.action as UserLogAction]?.color}>
                    {actionConfigs[selectedLog.action as UserLogAction]?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='模块'>
                  <Tag color={moduleConfigs[selectedLog.module as UserLogModule]?.color}>
                    {moduleConfigs[selectedLog.module as UserLogModule]?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='日志类型'>
                  <Tag color={logTypeConfigs[selectedLog.log_type as UserLogType]?.color}>
                    {logTypeConfigs[selectedLog.log_type as UserLogType]?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='状态'>
                  <Tag color={statusConfigs[selectedLog.status as UserLogStatus]?.color}>
                    {statusConfigs[selectedLog.status as UserLogStatus]?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='已读状态'>
                  <Tag color={selectedLog.hasRead ? 'green' : 'red'}>
                    {selectedLog.hasRead ? '已读' : '未读'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='IP地址'>
                  {selectedLog.ip_address || '-'}
                </Descriptions.Item>
                <Descriptions.Item label='操作时间'>
                  {dayjs(selectedLog.created_at).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>

              {selectedLog.target_name && (
                <>
                  <Divider />
                  <Descriptions title='目标信息' bordered column={1} size='small'>
                    <Descriptions.Item label='目标ID'>
                      {selectedLog.target_id || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label='目标名称'>
                      {selectedLog.target_name}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}

              {selectedLog.user_agent && (
                <>
                  <Divider />
                  <Descriptions title='客户端信息' bordered column={1} size='small'>
                    <Descriptions.Item label='User-Agent'>
                      <Typography.Text copyable style={{ fontSize: '12px' }}>
                        {selectedLog.user_agent}
                      </Typography.Text>
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}

              {selectedLog.details && selectedLog.details !== '{}' && (
                <>
                  <Divider />
                  <Descriptions title='详细信息' bordered column={1} size='small'>
                    <Descriptions.Item label='详情'>
                      <Typography.Text copyable>
                        <pre
                          style={{
                            background: '#f5f5f5',
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            maxHeight: '200px',
                            overflow: 'auto',
                          }}
                        >
                          {JSON.stringify(JSON.parse(selectedLog.details), null, 2)}
                        </pre>
                      </Typography.Text>
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default UserLogs;
