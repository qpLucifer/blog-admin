import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Avatar,
  List,
  Tag,
  Space,
  Button,
  Tooltip,
  Badge,
  Typography,
  Spin,
  Alert,
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  MessageOutlined,
  TagsOutlined,
  SettingOutlined,
  CalendarOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  RiseOutlined,
  UserSwitchOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import ReactECharts from 'echarts-for-react';
import { useApi } from '../../hooks';
import { getDashboardStats, DashboardStats } from '../../api/dashboard';
import styles from './index.module.css';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  const {
    data: dashboardData,
    loading,
    error,
    execute: fetchDashboardData,
  } = useApi<DashboardStats>(() => getDashboardStats({ timeRange }));

  // 当时间范围改变时重新获取数据
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30秒刷新一次
    return () => clearInterval(interval);
  }, [timeRange]);

  // 生成趋势图配置
  const trendChartOption = useMemo(() => {
    if (!dashboardData?.weeklyStats) return {};

    const dates = dashboardData.weeklyStats.map(item => item.date);
    const users = dashboardData.weeklyStats.map(item => item.users);
    const blogs = dashboardData.weeklyStats.map(item => item.blogs);
    const comments = dashboardData.weeklyStats.map(item => item.comments);
    const views = dashboardData.weeklyStats.map(item => item.views);

    return {
      title: {
        text: '数据趋势分析',
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16,
          color: '#2d2350',
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#6a4bc6',
        borderWidth: 1,
        textStyle: { color: '#2d2350' },
      },
      legend: {
        data: ['用户数', '博客数', '评论数', '访问量'],
        bottom: 10,
        textStyle: { color: '#6a4bc6' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#ececec' } },
        axisLabel: { color: '#6a4bc6' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: { color: '#6a4bc6' },
      },
      series: [
        {
          name: '用户数',
          type: 'line',
          data: users,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#6a4bc6', width: 3 },
          itemStyle: { color: '#6a4bc6' },
        },
        {
          name: '博客数',
          type: 'line',
          data: blogs,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#52c41a', width: 3 },
          itemStyle: { color: '#52c41a' },
        },
        {
          name: '评论数',
          type: 'line',
          data: comments,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#faad14', width: 3 },
          itemStyle: { color: '#faad14' },
        },
        {
          name: '访问量',
          type: 'line',
          data: views,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#f5222d', width: 3 },
          itemStyle: { color: '#f5222d' },
        },
      ],
    };
  }, [dashboardData]);

  // 生成饼图配置
  const pieChartOption = useMemo(() => {
    if (!dashboardData?.topTags) return {};

    const data = dashboardData.topTags.map(tag => ({
      name: tag.name,
      value: tag.blog_count,
    }));

    return {
      title: {
        text: '标签分布',
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14,
          color: '#2d2350',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          name: '博客数量',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }, [dashboardData]);

  if (loading && !dashboardData) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size='large' />
        <Text>正在加载仪表板数据...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message='数据加载失败'
        description='无法获取仪表板数据，请检查网络连接或稍后重试'
        type='error'
        showIcon
        action={
          <Button size='small' onClick={fetchDashboardData}>
            重试
          </Button>
        }
      />
    );
  }

  return (
    <div className={styles.root}>
      {/* 欢迎标题区域 */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <Title level={2} className={styles.welcomeTitle}>
            <DashboardOutlined className={styles.welcomeIcon} />
            欢迎回来，管理员！
          </Title>
          <Text className={styles.welcomeSubtitle}>
            今天是{' '}
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </Text>
        </div>
        <div className={styles.headerActions}>
          <Space>
            <Button
              type={timeRange === 'week' ? 'primary' : 'default'}
              onClick={() => setTimeRange('week')}
              icon={<CalendarOutlined />}
            >
              本周
            </Button>
            <Button
              type={timeRange === 'month' ? 'primary' : 'default'}
              onClick={() => setTimeRange('month')}
              icon={<BarChartOutlined />}
            >
              本月
            </Button>
            <Button
              type={timeRange === 'quarter' ? 'primary' : 'default'}
              onClick={() => setTimeRange('quarter')}
              icon={<RiseOutlined />}
            >
              本季度
            </Button>
          </Space>
        </div>
      </div>

      {/* 核心统计卡片 */}
      <Row gutter={[24, 24]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.usersCard}`} hoverable>
            <Statistic
              title={
                <Space>
                  <UserOutlined className={styles.statIcon} />
                  <span>总用户数</span>
                </Space>
              }
              value={dashboardData?.totalUsers || 0}
              valueRender={() => (
                <CountUp end={dashboardData?.totalUsers || 0} duration={1.5} separator=',' />
              )}
              suffix={
                <div className={styles.statSuffix}>
                  <Text className={styles.todayChange}>+{dashboardData?.todayNewUsers || 0}</Text>
                  <Text className={styles.changeLabel}>今日新增</Text>
                </div>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.blogsCard}`} hoverable>
            <Statistic
              title={
                <Space>
                  <FileTextOutlined className={styles.statIcon} />
                  <span>总博客数</span>
                </Space>
              }
              value={dashboardData?.totalBlogs || 0}
              valueRender={() => (
                <CountUp end={dashboardData?.totalBlogs || 0} duration={1.5} separator=',' />
              )}
              suffix={
                <div className={styles.statSuffix}>
                  <Text className={styles.todayChange}>+{dashboardData?.todayNewBlogs || 0}</Text>
                  <Text className={styles.changeLabel}>今日新增</Text>
                </div>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.commentsCard}`} hoverable>
            <Statistic
              title={
                <Space>
                  <MessageOutlined className={styles.statIcon} />
                  <span>总评论数</span>
                </Space>
              }
              value={dashboardData?.totalComments || 0}
              valueRender={() => (
                <CountUp end={dashboardData?.totalComments || 0} duration={1.5} separator=',' />
              )}
              suffix={
                <div className={styles.statSuffix}>
                  <Text className={styles.todayChange}>
                    +{dashboardData?.todayNewComments || 0}
                  </Text>
                  <Text className={styles.changeLabel}>今日新增</Text>
                </div>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.tagsCard}`} hoverable>
            <Statistic
              title={
                <Space>
                  <TagsOutlined className={styles.statIcon} />
                  <span>总标签数</span>
                </Space>
              }
              value={dashboardData?.totalTags || 0}
              valueRender={() => (
                <CountUp end={dashboardData?.totalTags || 0} duration={1.5} separator=',' />
              )}
              suffix={
                <div className={styles.statSuffix}>
                  <Text className={styles.todayChange}>+{dashboardData?.todayNewTags || 0}</Text>
                  <Text className={styles.changeLabel}>今日新增</Text>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[24, 24]} className={styles.chartsRow}>
        <Col xs={24} lg={16}>
          <Card className={styles.chartCard} title='数据趋势分析'>
            <ReactECharts
              option={trendChartOption}
              style={{ height: 400 }}
              className={styles.chart}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className={styles.chartCard} title='标签分布'>
            <ReactECharts
              option={pieChartOption}
              style={{ height: 400 }}
              className={styles.chart}
            />
          </Card>
        </Col>
      </Row>

      {/* 热门内容和用户活跃度 */}
      <Row gutter={[24, 24]} className={styles.contentRow}>
        <Col xs={24} lg={12}>
          <Card
            className={styles.contentCard}
            title={
              <Space>
                <FireOutlined style={{ color: '#ff4d4f' }} />
                热门博客排行
              </Space>
            }
          >
            <List
              dataSource={dashboardData?.topBlogs || []}
              renderItem={(blog, index) => (
                <List.Item className={styles.blogItem}>
                  <List.Item.Meta
                    avatar={
                      <Badge count={index + 1} className={styles.rankBadge}>
                        <Avatar
                          size={40}
                          className={styles.rankAvatar}
                          style={{
                            backgroundColor: index < 3 ? '#ffd700' : '#f0f0f0',
                            color: index < 3 ? '#000' : '#666',
                          }}
                        >
                          {index < 3 ? <TrophyOutlined /> : index + 1}
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <Tooltip title={blog.title}>
                        <Text strong className={styles.blogTitle}>
                          {blog.title}
                        </Text>
                      </Tooltip>
                    }
                    description={
                      <Space size='large'>
                        <Space>
                          <EyeOutlined />
                          <Text>{blog.views}</Text>
                        </Space>
                        <Space>
                          <LikeOutlined />
                          <Text>{blog.likes}</Text>
                        </Space>
                        <Space>
                          <CommentOutlined />
                          <Text>{blog.comments_count}</Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className={styles.contentCard}
            title={
              <Space>
                <UserSwitchOutlined style={{ color: '#52c41a' }} />
                活跃用户排行
              </Space>
            }
          >
            <List
              dataSource={dashboardData?.activeUsers || []}
              renderItem={(user, index) => (
                <List.Item className={styles.userItem}>
                  <List.Item.Meta
                    avatar={
                      <Badge count={index + 1} className={styles.rankBadge}>
                        <Avatar
                          size={40}
                          className={styles.userAvatar}
                          style={{
                            backgroundColor: index < 3 ? '#ffd700' : '#f0f0f0',
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong>{user.username}</Text>
                        {index < 3 && (
                          <Tag color='gold' icon={<TrophyOutlined />}>
                            TOP {index + 1}
                          </Tag>
                        )}
                      </Space>
                    }
                    description={
                      <Space size='large'>
                        <Space>
                          <FileTextOutlined />
                          <Text>{user.blog_count} 博客</Text>
                        </Space>
                        <Space>
                          <MessageOutlined />
                          <Text>{user.comment_count} 评论</Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态和最近活动 */}
      <Row gutter={[24, 24]} className={styles.systemRow}>
        <Col xs={24} lg={12}>
          <Card
            className={styles.systemCard}
            title={
              <Space>
                <SettingOutlined style={{ color: '#1890ff' }} />
                系统状态
              </Space>
            }
          >
            {dashboardData?.systemStatus && (
              <div className={styles.systemStatus}>
                <div className={styles.statusItem}>
                  <Text>CPU 使用率</Text>
                  <Progress
                    percent={dashboardData.systemStatus.cpu}
                    status={dashboardData.systemStatus.cpu > 80 ? 'exception' : 'normal'}
                    strokeColor='#6a4bc6'
                  />
                </div>
                <div className={styles.statusItem}>
                  <Text>内存使用率</Text>
                  <Progress
                    percent={dashboardData.systemStatus.memory}
                    status={dashboardData.systemStatus.memory > 80 ? 'exception' : 'normal'}
                    strokeColor='#52c41a'
                  />
                </div>
                <div className={styles.statusItem}>
                  <Text>磁盘使用率</Text>
                  <Progress
                    percent={dashboardData.systemStatus.disk}
                    status={dashboardData.systemStatus.disk > 80 ? 'exception' : 'normal'}
                    strokeColor='#faad14'
                  />
                </div>
                <div className={styles.statusItem}>
                  <Text>系统运行时间</Text>
                  <Text code>
                    {Math.floor(dashboardData.systemStatus.uptime / 3600)} 小时
                    {Math.floor((dashboardData.systemStatus.uptime % 3600) / 60)} 分钟
                  </Text>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className={styles.activityCard}
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#722ed1' }} />
                最近活动
              </Space>
            }
          >
            <List
              dataSource={dashboardData?.recentActivities || []}
              renderItem={activity => (
                <List.Item className={styles.activityItem}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={32}
                        className={styles.activityAvatar}
                        style={{
                          backgroundColor:
                            activity.type === 'user'
                              ? '#52c41a'
                              : activity.type === 'blog'
                                ? '#1890ff'
                                : activity.type === 'comment'
                                  ? '#faad14'
                                  : '#722ed1',
                        }}
                      >
                        {activity.type === 'user' ? (
                          <UserOutlined />
                        ) : activity.type === 'blog' ? (
                          <FileTextOutlined />
                        ) : activity.type === 'comment' ? (
                          <MessageOutlined />
                        ) : (
                          <SettingOutlined />
                        )}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong>{activity.action}</Text>
                        <Tag
                          color={
                            activity.type === 'user'
                              ? 'green'
                              : activity.type === 'blog'
                                ? 'blue'
                                : activity.type === 'comment'
                                  ? 'orange'
                                  : 'purple'
                          }
                        >
                          {activity.type}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Text type='secondary'>{activity.description}</Text>
                        <br />
                        <Text type='secondary' className={styles.activityTime}>
                          {new Date(activity.timestamp).toLocaleString('zh-CN')}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
