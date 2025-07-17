import { useAppSelector } from './useRedux';
import { selectUserMenus } from '../store/slices/authSlice';
import { hasPermissionRecursive } from '../utils/menuUtils';
import { useLocation } from 'react-router-dom';

/**
 * 用于判断当前用户是否有某菜单的某项操作权限
 * @returns { hasPermission } 传入菜单path和操作类型（create/read/update/delete），返回布尔值
 */
export const useMenuPermission = function () {
    const location = useLocation();
  const menus = useAppSelector(selectUserMenus);

  /**
   * 判断是否有权限
   * @param path 菜单路径
   * @param action 权限类型: create/read/update/delete
   */
  function hasPermission(action: 'create' | 'read' | 'update' | 'delete' = 'read'): boolean {
    return hasPermissionRecursive(menus, location.pathname, action);
  }

  return { hasPermission };
}; 