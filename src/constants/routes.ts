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
  BLOGS: '/blogs',
  COMMENTS: '/comments',
  TAGS: '/tags',
} as const;

// 路由权限配置
export const ROUTE_PERMISSIONS = {
  [ROUTES.DASHBOARD]: ['read'],
  [ROUTES.USERS]: ['create', 'read', 'update', 'delete'],
  [ROUTES.ROLES]: ['create', 'read', 'update', 'delete'],
  [ROUTES.PERMISSIONS]: ['read'],
  [ROUTES.MENUS]: ['create', 'read', 'update', 'delete'],
  [ROUTES.DAY_SENTENCE]: ['create', 'read', 'update', 'delete'],
  [ROUTES.PROFILE]: ['read'],
  [ROUTES.BLOGS]: ['create', 'read', 'update', 'delete'],
  [ROUTES.COMMENTS]: ['create', 'read', 'update', 'delete'],
  [ROUTES.TAGS]: ['create', 'read', 'update', 'delete'],
} as const;

// 菜单配置
export const MENU_CONFIG = {
  DASHBOARD: { name: '首页', path: '/dashboard', icon: 'HomeOutlined' },
  USERS: { name: '用户管理', path: '/users', icon: 'UserOutlined' },
  ROLES: { name: '角色管理', path: '/roles', icon: 'TeamOutlined' },
  MENUS: { name: '菜单管理', path: '/menus', icon: 'MenuOutlined' },
  DAY_SENTENCE: { name: '每日一句', path: '/day-sentence', icon: 'BulbOutlined' },
  BLOGS: { name: '博客管理', path: '/blogs', icon: 'FileTextOutlined' },
  COMMENTS: { name: '评论管理', path: '/comments', icon: 'CommentOutlined' },
  TAGS: { name: '标签管理', path: '/tags', icon: 'TagOutlined' },
} as const; 