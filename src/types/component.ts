/**
 * 组件相关类型定义
 * 包含各种组件的Props接口定义
 */

import { FormInstance } from 'antd/lib/form';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { TableColumn, OperationPermissions } from './common';
import { BlogData, TagData, CommentData } from './blog';
import { Role, Menu } from './user';

// 表单弹窗组件Props
export interface FormModalProps {
  title: string;
  visible: boolean;
  loading?: boolean;
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: any) => void | Promise<void>;
  children: React.ReactNode;
  width?: number;
  okText?: string;
  cancelText?: string;
  form?: FormInstance;
}

// 删除确认弹窗组件Props
export interface DeleteModalProps {
  visible: boolean;
  loading?: boolean;
  title?: string;
  content?: string;
  recordName?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  okText?: string;
  cancelText?: string;
}

// 操作按钮组件Props
export interface ActionButtonsProps {
  record: any;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  editText?: string;
  deleteText?: string;
  deleteConfirmText?: string;
  showEdit?: boolean;
  showDelete?: boolean;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  size?: 'small' | 'middle' | 'large';
}

// 通用表格组件Props
export interface CommonTableProps<T = any> {
  // 数据相关
  dataSource: T[];
  columns: TableColumn[];
  loading?: boolean;
  error?: string | null;

  // 分页相关
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
    onChange?: (page: number, pageSize: number) => void;
  };

  // 操作相关
  onReload?: () => void;
  rowKey?: string | ((record: T) => string);
  scroll?: { x?: number | string; y?: number | string };

  // 样式相关
  className?: string;
  size?: SizeType;
}

// 搜索卡片组件Props
export interface SearchCardProps {
  title?: string;
  form: any;
  onFinish: (values: any) => void;
  onReset: () => void;
  loading?: boolean;
  children: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  showCollapse?: boolean;
}

// 表格工具栏组件Props
export interface TableToolbarProps {
  title: string;
  showAdd?: boolean;
  addButtonText?: string;
  onAdd?: () => void;
  onReload?: () => void;
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  onBatchDelete?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  extra?: React.ReactNode;
  operations?: OperationPermissions;
}

// 表格容器组件Props
export interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

// 表格按钮组件Props
export interface CommonTableButtonProps {
  loading?: boolean;
  onReload?: () => void;
  onAdd?: () => void;
  title?: string;
  addButtonText?: string;
  operations?: OperationPermissions;
}

// 错误边界组件Props
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// 用户表单组件Props
export interface UserFormProps {
  isEdit?: boolean;
  roles?: Role[];
}

// 角色表单组件Props
export interface RoleFormProps {
  isEdit?: boolean;
  menus?: Menu[];
}

// 菜单表单组件Props
export interface MenuFormProps {
  menus?: any[]; // 所有菜单树
  currentId?: number | null; // 当前编辑菜单id
}

// 博客表单组件Props
export interface BlogFormProps {
  isEdit?: boolean;
  tags?: TagData[];
  initialValues?: any;
  onSubmit?: (values: any) => void;
}

// 评论表单组件Props
export interface CommentFormProps {
  blogs?: BlogData[];
  comments?: CommentData[];
  form?: any;
  isReply?: boolean;
  replyInfo?: {
    parentId: number | undefined;
    blogId: number;
    blogTitle: string;
  };
}

// 图标选择器组件Props
export interface IconSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

// 路由加载组件Props
export interface RouteLoadingProps {
  tip?: string;
}

// 私有路由组件Props
export interface PrivateRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

// 公共路由组件Props
export interface PublicRouteProps {
  children: React.ReactNode;
}

// CRUD Hook相关类型
export interface UseCrudOptions<T = any> {
  // API 函数
  createApi?: (data: any) => any;
  updateApi?: (id: number | string, data: any) => any;
  deleteApi?: (id: number | string) => any;

  // 消息提示
  createSuccessMessage?: string;
  updateSuccessMessage?: string;
  deleteSuccessMessage?: string;

  // 回调函数
  onSuccess?: (type: 'create' | 'update' | 'delete', data?: T) => void;
  onError?: (type: 'create' | 'update' | 'delete', error: any) => void;
}

export interface UseCrudReturn<T = any> {
  // 状态
  modalVisible: boolean;
  deleteModalVisible: boolean;
  loading: boolean;
  currentRecord: T | null;
  isEdit: boolean;

  // 操作方法
  showCreateModal: () => void;
  showEditModal: (record: T) => void;
  hideModal: () => void;
  showDeleteModal: (record: T) => void;
  hideDeleteModal: () => void;

  // 提交方法
  handleCreate: (values: any) => Promise<void>;
  handleUpdate: (values: any) => Promise<void>;
  handleDelete: () => Promise<void>;
}
