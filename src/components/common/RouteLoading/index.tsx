import React from 'react';
import { Spin, Progress } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { RouteLoadingProps } from '../../../types';
import styles from './index.module.css';

const RouteLoading: React.FC<RouteLoadingProps> = ({
  tip = '页面加载中...',
  showProgress = false,
  progress = 0,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Spin indicator={antIcon} size='large' />
        <div className={styles.tip}>{tip}</div>
        {showProgress && (
          <div className={styles.progressContainer}>
            <Progress
              percent={progress}
              size='small'
              showInfo={false}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteLoading;
