import { useMenuPermission } from './useMenuPermission';
import { useCrud } from './useCrud';

/**
 * 通用的CRUD操作hook
 * @param config CRUD配置
 * @returns CRUD操作和权限状态
 */
export const useCrudOperations = <T>(config: {
  createApi: (data: any) => Promise<any>;
  updateApi: (data: any) => Promise<any>;
  deleteApi: (id: string | number) => Promise<any>;
  createSuccessMessage?: string;
  updateSuccessMessage?: string;
  deleteSuccessMessage?: string;
  onSuccess?: () => void;
  path: string; // 菜单路径，用于权限判断
}) => {
  const { hasPermission } = useMenuPermission();
  
  const crud = useCrud<T>({
    createApi: config.createApi,
    updateApi: config.updateApi,
    deleteApi: config.deleteApi,
    createSuccessMessage: config.createSuccessMessage,
    updateSuccessMessage: config.updateSuccessMessage,
    deleteSuccessMessage: config.deleteSuccessMessage,
    onSuccess: config.onSuccess,
  });

  // 权限状态
  const permissions = {
    canCreate: hasPermission(config.path, 'create'),
    canRead: hasPermission(config.path, 'read'),
    canUpdate: hasPermission(config.path, 'update'),
    canDelete: hasPermission(config.path, 'delete'),
  };

  return {
    ...crud,
    permissions,
  };
}; 