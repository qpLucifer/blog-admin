/**
 * API相关类型定义
 * 包含API请求响应、分页等相关类型
 */

// API响应基础类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 分页响应类型
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 列表响应类型
export interface ListResponse<T = any> {
  list: T[];
  total: number;
  pageSize: number;
  currentPage: number;
}

// 错误响应类型
export interface ErrorResponse {
  code: number;
  message: string;
  details?: any;
}

// 上传文件响应类型
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// 导出响应类型
export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  size: number;
}

// API请求配置类型
export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

// 请求参数类型
export interface RequestParams {
  [key: string]: any;
}

// 文件上传参数类型
export interface UploadParams {
  file: File;
  onProgress?: (percent: number) => void;
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: any) => void;
}

// 批量操作响应类型
export interface BatchOperationResponse {
  success: number;
  failed: number;
  total: number;
  errors?: Array<{
    id: number | string;
    error: string;
  }>;
}

// 统计数据响应类型
export interface StatsResponse {
  [key: string]: number | string;
}

// 搜索建议响应类型
export interface SearchSuggestionResponse {
  suggestions: string[];
  total: number;
}

// 验证响应类型
export interface ValidationResponse {
  valid: boolean;
  message?: string;
  field?: string;
}
