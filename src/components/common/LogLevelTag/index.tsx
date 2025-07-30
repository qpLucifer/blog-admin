import React from 'react';
import { Tag } from 'antd';
import {
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  BugOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { LogLevel } from '../../../types';
import styles from './index.module.css';

interface LogLevelTagProps {
  level: LogLevel;
  size?: 'small' | 'default';
  showIcon?: boolean;
  style?: React.CSSProperties;
}

const LogLevelTag: React.FC<LogLevelTagProps> = ({
  level,
  size = 'small',
  showIcon = true,
  style,
}) => {
  const getLevelConfig = (level: LogLevel) => {
    const configs = {
      error: {
        color: '#ff4d4f',
        backgroundColor: '#fff2f0',
        borderColor: '#ffccc7',
        icon: <ExclamationCircleOutlined />,
        text: 'ERROR',
        textColor: '#a8071a',
      },
      warn: {
        color: '#faad14',
        backgroundColor: '#fff7e6',
        borderColor: '#ffd591',
        icon: <WarningOutlined />,
        text: 'WARN',
        textColor: '#ad6800',
      },
      info: {
        color: '#1890ff',
        backgroundColor: '#f0f5ff',
        borderColor: '#adc6ff',
        icon: <InfoCircleOutlined />,
        text: 'INFO',
        textColor: '#0958d9',
      },
      debug: {
        color: '#722ed1',
        backgroundColor: '#f9f0ff',
        borderColor: '#d3adf7',
        icon: <BugOutlined />,
        text: 'DEBUG',
        textColor: '#531dab',
      },
      verbose: {
        color: '#8c8c8c',
        backgroundColor: '#fafafa',
        borderColor: '#d9d9d9',
        icon: <FileTextOutlined />,
        text: 'VERBOSE',
        textColor: '#595959',
      },
    };
    return configs[level] || configs.info;
  };

  const config = getLevelConfig(level);

  return (
    <Tag
      className={`${styles.logLevelTag} ${styles[level]} ${size === 'small' ? styles.small : ''}`}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        color: config.textColor,
        ...style,
      }}
    >
      {showIcon && (
        <span className={styles.icon} style={{ color: config.color }}>
          {config.icon}
        </span>
      )}
      <span className={styles.text}>{config.text}</span>
    </Tag>
  );
};

export default LogLevelTag;
