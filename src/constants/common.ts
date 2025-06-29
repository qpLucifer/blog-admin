// 通用常量
export const APP_NAME = 'Blog Admin';

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// 状态常量
export const STATUS = {
  ENABLED: 1,
  DISABLED: 0,
} as const;

// 状态标签配置
export const STATUS_CONFIG = {
  [STATUS.ENABLED]: {
    text: '启用',
    color: 'green',
  },
  [STATUS.DISABLED]: {
    text: '禁用',
    color: 'red',
  },
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  USER_PERMISSIONS: 'userPermissions',
  THEME: 'theme',
} as const; 