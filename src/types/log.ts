/**
 * 日志相关类型定义
 * 包含日志文件、日志条目、统计信息等相关类型
 */

// 日志文件类型
export type LogFileType =
  | 'error'
  | 'auth'
  | 'business'
  | 'system'
  | 'api'
  | 'security'
  | 'database';

// 日志级别类型
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

// 日志文件信息
export interface LogFile {
  name: string;
  size: number;
  modified: string | Date;
  type: LogFileType;
  path: string; // 新增：文件路径，格式为 type/filename
}

// 日志条目
export interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  message: string;
  meta: Record<string, any>;
  raw: string;
}

// 日志内容响应
export interface LogContentResponse {
  list: LogEntry[];
  total: number;
  page: number;
  pageSize: number;
  filename: string;
}

// 日志统计信息
export interface LogStats {
  totalFiles: number;
  totalSize: number;
  fileTypes: {
    error: number;
    auth: number;
    business: number;
    system: number;
    api: number;
    security: number;
    database: number;
  };
  recentLogs: Array<{
    name: string;
    size: number;
    modified: string | Date;
  }>;
}

// 日志查询参数
export interface LogQueryParams {
  page?: number;
  pageSize?: number;
  level?: LogLevel;
  search?: string;
}

// 日志清理参数
export interface LogCleanParams {
  days?: number;
}

// 日志清理响应
export interface LogCleanResponse {
  deletedCount: number;
}

// 日志文件查询参数
export interface LogFileQueryParams {
  type?: LogFileType;
  sortBy?: 'name' | 'size' | 'modified';
  sortOrder?: 'asc' | 'desc';
}

// 日志级别配置
export interface LogLevelConfig {
  level: LogLevel;
  color: string;
  backgroundColor: string;
  icon: string;
  priority: number;
}

// 日志过滤器
export interface LogFilter {
  levels: LogLevel[];
  timeRange?: {
    start: string;
    end: string;
  };
  keyword?: string;
  includeMetadata?: boolean;
}

// 日志导出参数
export interface LogExportParams {
  filename: string;
  format?: 'json' | 'csv' | 'txt';
  filter?: LogFilter;
}

// 日志实时更新配置
export interface LogRealtimeConfig {
  enabled: boolean;
  interval: number; // 刷新间隔（毫秒）
  maxEntries: number; // 最大显示条目数
  autoScroll: boolean; // 自动滚动到底部
}

// 日志查看器配置
export interface LogViewerConfig {
  theme: 'light' | 'dark';
  fontSize: number;
  lineHeight: number;
  showLineNumbers: boolean;
  showTimestamp: boolean;
  showLevel: boolean;
  showMetadata: boolean;
  highlightKeywords: string[];
  wordWrap: boolean;
}

// 日志搜索建议
export interface LogSearchSuggestion {
  type: 'level' | 'keyword' | 'timestamp';
  value: string;
  count: number;
  description?: string;
}
