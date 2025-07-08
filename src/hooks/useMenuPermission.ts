import { useAppSelector } from './useRedux';
import { selectUserMenus } from '../store/slices/authSlice';

/**
 * 用于判断当前用户是否有某菜单的某项操作权限
 * @returns { hasPermission } 传入菜单path和操作类型（create/read/update/delete），返回布尔值
 */
export const useMenuPermission = function () {
  const menus = useAppSelector(selectUserMenus);

  // 支持多级菜单递归查找
  function findMenuByPath(menuList: any[], path: string): any | undefined {
    for (const menu of menuList) {
      if (menu.path === path) return menu;
      if (menu.children) {
        const found = findMenuByPath(menu.children, path);
        if (found) return found;
      }
    }
    return undefined;
  }

  /**
   * 判断是否有权限
   * @param path 菜单路径
   * @param action 权限类型: create/read/update/delete
   */
  function hasPermission(path: string): { create: boolean; read: boolean; update: boolean; delete: boolean; } {
    const menu = findMenuByPath(menus, path);
    if (!menu) return { create: false, read: false, update: false, delete: false };
    return {
      create: Boolean(menu.can_create),
      read: Boolean(menu.can_read),
      update: Boolean(menu.can_update),
      delete: Boolean(menu.can_delete),
    };
  }

  return { hasPermission };
} 