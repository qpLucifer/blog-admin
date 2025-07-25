import React from 'react';
import { Spin } from 'antd';
import styles from './index.module.css';

interface CoolLoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
}

const CoolLoading: React.FC<CoolLoadingProps> = ({
  size = 'default',
  tip = '加载中...',
  spinning = true,
  children,
}) => {
  const antIcon = (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
        <div className={styles.spinner}></div>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );

  if (children) {
    return (
      <Spin
        spinning={spinning}
        indicator={antIcon}
        tip={tip}
        size={size}
        className={styles.spinWrapper}
      >
        {children}
      </Spin>
    );
  }

  return (
    <div className={styles.fullPageLoading}>
      <div className={styles.loadingContent}>
        {antIcon}
        <div className={styles.loadingText}>{tip}</div>
        <div className={styles.loadingSubtext}>请稍候，正在为您加载精彩内容...</div>
      </div>
      <div className={styles.backgroundAnimation}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>
    </div>
  );
};

export default CoolLoading;
