/**
 * 通用基础类型定义
 * 包含项目中使用的通用类型、基础实体类型等
 */

// 基础实体类型
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// 权限类型别名
export type PermissionType = 'create' | 'read' | 'update' | 'delete';

// 表单字段类型
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'switch' | 'datePicker';
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  rules?: any[];
}

// 表格列类型
export interface TableColumn {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  render?: (value: any, record: any) => React.ReactNode;
  fixed?: 'left' | 'right';
}

// 分页参数类型
export interface PaginationParams {
  currentPage: number;
  pageSize: number;
}

// 查询参数基础类型
export interface BaseQueryParams extends PaginationParams {
  [key: string]: any;
}

// 操作权限类型
export interface OperationPermissions {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  export?: boolean;
  import?: boolean;
  batchDelete?: boolean;
}

// 选项类型
export interface Option {
  label: string;
  value: any;
  disabled?: boolean;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  disabled?: boolean;
}

// 导出相关类型
export interface ExportOptions {
  filename?: string;
  extension?: string;
  showMessage?: boolean;
}

export interface ExportParams {
  [key: string]: any;
}

// 文件下载类型
export interface DownloadFileOptions {
  blob: Blob;
  filename: string;
}
