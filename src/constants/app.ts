/**
 * 应用配置常量
 */

// 应用基本信息
export const APP_INFO = {
  NAME: '博客管理系统',
  VERSION: '1.0.0',
  DESCRIPTION: '基于React + TypeScript的博客后台管理系统',
  AUTHOR: 'Blog Admin Team',
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
  SHOW_TOTAL: true,
} as const;

// 表格配置
export const TABLE = {
  DEFAULT_SIZE: 'middle' as const,
  SCROLL_X: 1200,
  ROW_KEY: 'id',
  BORDER_RADIUS: 8,
} as const;

// 表单配置
export const FORM = {
  LAYOUT: 'vertical' as const,
  LABEL_COL: { span: 24 },
  WRAPPER_COL: { span: 24 },
  VALIDATE_TRIGGER: 'onBlur' as const,
} as const;

// 上传配置
export const UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_COUNT: 1,
} as const;

// 缓存配置
export const CACHE = {
  DEFAULT_EXPIRY: 5 * 60 * 1000, // 5分钟
  USER_INFO_EXPIRY: 30 * 60 * 1000, // 30分钟
  MENU_EXPIRY: 60 * 60 * 1000, // 1小时
} as const;

// 主题配置
export const THEME = {
  PRIMARY_COLOR: '#1890ff',
  SUCCESS_COLOR: '#52c41a',
  WARNING_COLOR: '#faad14',
  ERROR_COLOR: '#f5222d',
  BORDER_RADIUS: 8,
  BOX_SHADOW: '0 2px 8px rgba(0,0,0,0.15)',
} as const;

// 动画配置
export const ANIMATION = {
  DURATION: 300,
  EASING: 'ease-in-out',
  DELAY: 100,
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'blog_admin_token',
  USER_INFO: 'blog_admin_user_info',
  THEME: 'blog_admin_theme',
  LANGUAGE: 'blog_admin_language',
  SIDEBAR_COLLAPSED: 'blog_admin_sidebar_collapsed',
  TABLE_SETTINGS: 'blog_admin_table_settings',
} as const;

// 路由路径
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/admin/users',
  ROLES: '/admin/roles',
  MENUS: '/admin/menus',
  BLOGS: '/blogsManage/blogs',
  COMMENTS: '/blogsManage/comments',
  TAGS: '/blogsManage/tags',
  DAY_SENTENCE: '/day-sentence',
  PROFILE: '/profile',
} as const;

// 权限配置
export const PERMISSIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  EXPORT: 'export',
  IMPORT: 'import',
} as const;

// 状态配置
export const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  PUBLISHED: 1,
  DRAFT: 0,
  CHOICE: 1,
  NORMAL: 0,
} as const;

// 消息配置
export const MESSAGE = {
  SUCCESS_DURATION: 3,
  ERROR_DURATION: 5,
  WARNING_DURATION: 4,
  INFO_DURATION: 3,
} as const;

// 验证规则
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 20,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    PATTERN: /^1[3-9]\d{9}$/,
  },
} as const;

// 文件类型
export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
} as const;

// 日期格式
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const;

// 环境配置
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

// 当前环境
export const CURRENT_ENV = process.env.NODE_ENV || ENV.DEVELOPMENT;

// 是否为开发环境
export const IS_DEV = CURRENT_ENV === ENV.DEVELOPMENT;

// 是否为生产环境
export const IS_PROD = CURRENT_ENV === ENV.PRODUCTION;
