import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import styles from './index.module.css';
// 用 require 方式引入，避免类型报错
import ReactECharts from 'echarts-for-react';

const Dashboard: React.FC = () => {
  // 示例数据
  const visitData = {
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    visits: [120, 200, 150, 80, 70, 110, 130],
  };

  const chartOption = {
    title: {
      text: '一周访问量趋势',
      left: 'center',
      textStyle: { fontWeight: 'normal', fontSize: 16 }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: visitData.days,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#ececec' } },
      axisLabel: { color: '#6a4bc6' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { color: '#6a4bc6' }
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        data: visitData.visits,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#6a4bc6', width: 3 },
        itemStyle: { color: '#a18cd1' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#a18cd1aa' },
              { offset: 1, color: '#fff' }
            ]
          }
        }
      }
    ]
  };

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>欢迎来到博客后台管理系统</h2>
      <Row gutter={24}>
        <Col span={8}>
          <Card className={styles.card}>
            <Statistic title="用户数" valueRender={() => <CountUp end={1024} duration={1.2} />} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.card}>
            <Statistic title="角色数" valueRender={() => <CountUp end={8} duration={1.2} />} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.card}>
            <Statistic title="每日一句" valueRender={() => <CountUp end={365} duration={1.2} />} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 32, borderRadius: 16 }}>
        <ReactECharts option={chartOption} style={{ height: 320 }} />
      </Card>
    </div>
  );
};

export default Dashboard; 