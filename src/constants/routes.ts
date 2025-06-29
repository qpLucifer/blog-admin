// 路由相关常量
export const ROUTES = {
  // 公共路由
  LOGIN: '/login',
  NOT_FOUND: '/404',
  
  // 受保护的路由
  DASHBOARD: '/dashboard',
  USERS: '/users',
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
  MENUS: '/menus',
  DAY_SENTENCE: '/day-sentence',
  PROFILE: '/profile',
} as const;

// 路由权限配置
export const ROUTE_PERMISSIONS = {
  [ROUTES.DASHBOARD]: ['dashboard:view'],
  [ROUTES.USERS]: ['user:view'],
  [ROUTES.ROLES]: ['role:view'],
  [ROUTES.PERMISSIONS]: ['permission:view'],
  [ROUTES.MENUS]: ['menu:view'],
  [ROUTES.DAY_SENTENCE]: ['day-sentence:view'],
  [ROUTES.PROFILE]: ['profile:view'],
} as const; 