/**
 * 简化的操作日志相关类型定义
 */

// 操作类型
export type UserLogAction = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view';

// 模块类型
export type UserLogModule =
  | 'auth'
  | 'user'
  | 'blog'
  | 'comment'
  | 'tag'
  | 'role'
  | 'menu'
  | 'daySentence'
  | 'upload';

// 日志类型
export type UserLogType = 'operation' | 'security' | 'system' | 'error';

// 操作状态
export type UserLogStatus = 'success' | 'failed' | 'error';

// 用户操作日志
export interface UserLog {
  id: number;
  user_id?: number;
  username?: string;
  action: UserLogAction;
  module: UserLogModule;
  log_type: UserLogType;
  target_id?: number;
  target_name?: string;
  ip_address?: string;
  user_agent?: string;
  details?: string;
  status: UserLogStatus;
  hasRead?: boolean;
  created_at: string;
  updated_at: string;
}

// 用户日志查询参数
export interface UserLogQueryParams {
  username?: string;
  action?: UserLogAction;
  module?: UserLogModule;
  log_type?: UserLogType;
  ip_address?: string;
  status?: UserLogStatus;
  start_date?: string;
  end_date?: string;
  pageSize?: number;
  currentPage?: number;
}

// 用户日志列表响应
export interface UserLogListResponse {
  list: UserLog[];
  total: number;
  pageSize: number;
  currentPage: number;
}

// 日志统计信息
export interface LogStats {
  todayCount: number;
  recentCount: number;
  moduleStats: Array<{
    module: string;
    count: number;
  }>;
  actionStats: Array<{
    action: string;
    count: number;
  }>;
  logTypeStats: Array<{
    log_type: string;
    count: number;
  }>;
}

// 日志清理参数
export interface LogCleanParams {
  days?: number;
}

// 日志清理响应
export interface LogCleanResponse {
  deletedCount: number;
}

// 操作类型配置
export interface UserLogActionConfig {
  action: UserLogAction;
  label: string;
  color: string;
  icon: string;
}

// 模块类型配置
export interface UserLogModuleConfig {
  module: UserLogModule;
  label: string;
  color: string;
  icon: string;
}

// 日志类型配置
export interface UserLogTypeConfig {
  log_type: UserLogType;
  label: string;
  color: string;
  icon: string;
}

// 状态类型配置
export interface UserLogStatusConfig {
  status: UserLogStatus;
  label: string;
  color: string;
  icon: string;
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
