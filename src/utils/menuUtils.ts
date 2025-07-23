import { Menu } from '../types';

/**
 * 递归查找菜单
 * @param menuList 菜单列表
 * @param path 菜单路径
 * @returns 找到的菜单或undefined
 */
export const findMenuByPath = (menuList: Menu[], path: string): Menu | undefined => {
  for (const menu of menuList) {
    if (menu.path === path) return menu;
    if (menu.children) {
      const found = findMenuByPath(menu.children, path);
      if (found) return found;
    }
  }
  return undefined;
};

/**
 * 递归检查权限
 * @param menus 菜单列表
 * @param path 菜单路径
 * @param action 权限类型
 * @returns 是否有权限
 */
export const hasPermissionRecursive = (
  menus: Menu[],
  path: string,
  action: 'create' | 'read' | 'update' | 'delete' = 'read'
): boolean => {
  const menu = findMenuByPath(menus, path);
  if (!menu) return false;
  return Boolean(menu[`can_${action}`]);
};

/**
 * 递归检查路由权限
 * @param menus 菜单列表
 * @param path 路由路径
 * @returns 是否有权限访问
 */
export const hasRoutePermission = (menus: Menu[], path: string): boolean => {
  for (const menu of menus) {
    if (path.startsWith(menu.path)) return true;
    if (menu.children && hasRoutePermission(menu.children, path)) return true;
  }
  return false;
};

/**
 * 递归检查操作权限
 * @param menus 菜单列表
 * @param permission 权限类型
 * @returns 是否有权限
 */
export const hasActionPermission = (menus: Menu[], permission: string): boolean => {
  for (const menu of menus) {
    // 检查菜单的权限字段
    if (menu.can_read && permission === 'read') return true;
    if (menu.can_create && permission === 'create') return true;
    if (menu.can_update && permission === 'update') return true;
    if (menu.can_delete && permission === 'delete') return true;
    // 递归检查子菜单
    if (menu.children && hasActionPermission(menu.children, permission)) return true;
  }
  return false;
};

/**
 * 构建菜单树
 * @param list 平铺的菜单列表
 * @param parentId 父级ID
 * @returns 树形菜单
 */
export const buildMenuTree = (list: Menu[], parentId: number | null = null): Menu[] => {
  return list
    .filter(item => item.parent_id === parentId)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(item => ({
      ...item,
      children: buildMenuTree(list, item.id),
    }));
};
