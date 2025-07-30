import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card,
  Input,
  Select,
  Button,
  Space,
  Tooltip,
  Badge,
  Empty,
  Spin,
  Typography,
  Divider,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ClearOutlined,
  FullscreenOutlined,
  CompressOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';
import { LogEntry, LogLevel, LogViewerConfig, LogRealtimeConfig } from '../../../types';
import LogLevelTag from '../LogLevelTag';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

interface LogViewerProps {
  logs: LogEntry[];
  loading?: boolean;
  filename?: string;
  config?: LogViewerConfig;
  realtimeConfig?: LogRealtimeConfig;
  onSearch?: (keyword: string) => void;
  onLevelFilter?: (levels: LogLevel[]) => void;
  onRefresh?: () => void;
  onDownload?: () => void;
  onConfigChange?: (config: LogViewerConfig) => void;
  onRealtimeToggle?: (enabled: boolean) => void;
}

const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  loading = false,
  filename,
  config = {
    theme: 'dark',
    fontSize: 13,
    lineHeight: 1.5,
    showLineNumbers: true,
    showTimestamp: true,
    showLevel: true,
    showMetadata: false,
    highlightKeywords: [],
    wordWrap: true,
  },
  realtimeConfig = {
    enabled: false,
    interval: 5000,
    maxEntries: 100,
    autoScroll: true,
  },
  onSearch,
  onLevelFilter,
  onRefresh,
  onDownload,
  onRealtimeToggle,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<LogLevel[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(realtimeConfig.enabled);
  const viewerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // 过滤日志
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // 按级别过滤
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(log => selectedLevels.includes(log.level));
    }

    // 按关键词过滤
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.message.toLowerCase().includes(keyword) || log.raw.toLowerCase().includes(keyword)
      );
    }

    return filtered;
  }, [logs, selectedLevels, searchKeyword]);

  // 实时刷新
  useEffect(() => {
    if (realtimeEnabled && onRefresh) {
      intervalRef.current = setInterval(() => {
        onRefresh();
      }, realtimeConfig.interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [realtimeEnabled, realtimeConfig.interval, onRefresh]);

  // 自动滚动到底部
  useEffect(() => {
    if (realtimeConfig.autoScroll && viewerRef.current) {
      viewerRef.current.scrollTop = viewerRef.current.scrollHeight;
    }
  }, [filteredLogs, realtimeConfig.autoScroll]);

  // 高亮关键词
  const highlightText = (text: string) => {
    if (!searchKeyword) return text;

    const regex = new RegExp(`(${searchKeyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // 切换实时模式
  const handleRealtimeToggle = (enabled: boolean) => {
    setRealtimeEnabled(enabled);
    onRealtimeToggle?.(enabled);
  };

  // 切换全屏
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 清空搜索
  const clearSearch = () => {
    setSearchKeyword('');
    onSearch?.('');
  };

  // 渲染日志条目
  const renderLogEntry = (log: LogEntry, index: number) => (
    <div key={log.id} className={styles.logEntry}>
      {config.showLineNumbers && <span className={styles.lineNumber}>{index + 1}</span>}
      {config.showTimestamp && (
        <span className={styles.timestamp}>{new Date(log.timestamp).toLocaleString()}</span>
      )}
      {config.showLevel && <LogLevelTag level={log.level} />}
      <span className={styles.message}>{highlightText(log.message)}</span>
      {config.showMetadata && Object.keys(log.meta).length > 0 && (
        <div className={styles.metadata}>
          <Text type='secondary' style={{ fontSize: 12 }}>
            {JSON.stringify(log.meta, null, 2)}
          </Text>
        </div>
      )}
    </div>
  );

  return (
    <Card
      className={`${styles.logViewerCard} ${isFullscreen ? styles.fullscreen : ''}`}
      title={
        <Space>
          <Text strong>{filename || '日志查看器'}</Text>
          <Badge count={filteredLogs.length} showZero />
          {realtimeEnabled && <Badge status='processing' text='实时' />}
        </Space>
      }
      extra={
        <Space>
          <Tooltip title={realtimeEnabled ? '暂停实时' : '开启实时'}>
            <Button
              type='text'
              icon={realtimeEnabled ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleRealtimeToggle(!realtimeEnabled)}
            />
          </Tooltip>
          <Tooltip title='刷新'>
            <Button type='text' icon={<ReloadOutlined />} loading={loading} onClick={onRefresh} />
          </Tooltip>
          <Tooltip title='下载'>
            <Button type='text' icon={<DownloadOutlined />} onClick={onDownload} />
          </Tooltip>
          <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
            <Button
              type='text'
              icon={isFullscreen ? <CompressOutlined /> : <FullscreenOutlined />}
              onClick={toggleFullscreen}
            />
          </Tooltip>
        </Space>
      }
    >
      {/* 搜索和过滤工具栏 */}
      <div className={styles.toolbar}>
        <Space wrap>
          <Search
            placeholder='搜索日志内容...'
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onSearch={onSearch}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            mode='multiple'
            placeholder='选择日志级别'
            value={selectedLevels}
            onChange={levels => {
              setSelectedLevels(levels);
              onLevelFilter?.(levels);
            }}
            style={{ minWidth: 200 }}
            allowClear
          >
            <Option value='error'>错误</Option>
            <Option value='warn'>警告</Option>
            <Option value='info'>信息</Option>
            <Option value='debug'>调试</Option>
            <Option value='verbose'>详细</Option>
          </Select>
          <Button
            icon={<ClearOutlined />}
            onClick={clearSearch}
            disabled={!searchKeyword && selectedLevels.length === 0}
          >
            清空过滤
          </Button>
        </Space>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* 日志内容区域 */}
      <div
        ref={viewerRef}
        className={`${styles.logContent} ${styles[config.theme]}`}
        style={{
          fontSize: config.fontSize,
          lineHeight: config.lineHeight,
          wordWrap: config.wordWrap ? 'break-word' : 'normal',
        }}
      >
        <Spin spinning={loading}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => renderLogEntry(log, index))
          ) : (
            <Empty description='暂无日志数据' image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Spin>
      </div>
    </Card>
  );
};

export default LogViewer;
