# Blog Admin 项目结构优化指南

## 📁 优化后的项目结构

```
src/
├── api/                    # API 接口层
│   ├── index.ts           # API 实例和拦截器配置
│   ├── auth.ts            # 认证相关 API
│   ├── user.ts            # 用户相关 API
│   └── types.ts           # API 响应类型
├── components/            # 可复用组件
│   ├── common/            # 通用组件
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Table/
│   ├── forms/             # 表单组件
│   │   ├── UserForm/
│   │   └── RoleForm/
│   ├── layout/            # 布局组件
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   └── index.ts           # 统一导出
├── hooks/                 # 自定义 Hooks
│   ├── index.ts           # 统一导出所有 hooks
│   ├── useApi.ts          # API 调用 hook
│   ├── useCrud.ts         # CRUD 操作 hook
│   ├── useAuth.ts         # 认证相关 hook
│   └── useTable.ts        # 表格相关 hook
├── pages/                 # 页面组件
│   ├── auth/              # 认证相关页面
│   │   └── Login/
│   ├── dashboard/         # 仪表板页面
│   ├── user/              # 用户管理页面
│   ├── role/              # 角色管理页面
│   └── permission/        # 权限管理页面
├── store/                 # Redux 状态管理
│   ├── index.ts           # Store 配置
│   ├── hooks.ts           # Redux hooks (类型化)
│   └── slices/            # Redux slices
│       ├── authSlice.ts
│       └── userSlice.ts
├── types/                 # TypeScript 类型定义
│   ├── index.ts           # 统一类型导出
│   ├── api.ts             # API 相关类型
│   ├── auth.ts            # 认证相关类型
│   └── common.ts          # 通用类型
├── utils/                 # 工具函数
│   ├── index.ts           # 统一工具函数导出
│   ├── auth.ts            # 认证工具
│   ├── format.ts          # 格式化工具
│   └── validation.ts      # 验证工具
├── constants/             # 常量定义
│   ├── index.ts
│   ├── api.ts
│   └── routes.ts
├── styles/                # 样式文件
│   ├── global.css
│   ├── variables.css
│   └── components.css
└── router/                # 路由配置
    ├── index.tsx
    ├── routes.ts
    └── guards.ts
```

## 🔧 主要优化点

### 1. **Hooks 统一管理**
- ✅ 所有自定义 hooks 统一在 `src/hooks/` 目录下
- ✅ 通过 `src/hooks/index.ts` 统一导出
- ✅ Redux hooks 保留在 `src/store/hooks.ts`，但在 hooks 中重新导出

### 2. **类型定义集中化**
- ✅ 所有 TypeScript 类型定义在 `src/types/` 目录
- ✅ 按功能模块分类：`api.ts`, `auth.ts`, `common.ts`
- ✅ 通过 `src/types/index.ts` 统一导出

### 3. **工具函数整理**
- ✅ 所有工具函数在 `src/utils/` 目录
- ✅ 按功能分类：认证、格式化、验证等
- ✅ 通过 `src/utils/index.ts` 统一导出

### 4. **组件结构优化**
- ✅ 按功能分类：`common/`, `forms/`, `layout/`
- ✅ 每个组件目录包含：`index.tsx`, `index.module.css`, `README.md`
- ✅ 通过 `src/components/index.ts` 统一导出

### 5. **API 层优化**
- ✅ 统一的 API 实例配置
- ✅ 按功能模块分离 API 文件
- ✅ 统一的错误处理和拦截器

## 📋 最佳实践

### 1. **导入规范**
```typescript
// ✅ 推荐：从统一入口导入
import { useApi, useCrud } from '@/hooks';
import { User, Role } from '@/types';
import { formatDate, hasPermission } from '@/utils';
import { Button, Modal } from '@/components';

// ❌ 避免：直接从具体文件导入
import { useApi } from '@/hooks/useApi';
import { User } from '@/types/auth';
```

### 2. **组件开发规范**
```typescript
// ✅ 推荐：组件结构
components/UserForm/
├── index.tsx          # 主组件文件
├── index.module.css   # 样式文件
├── types.ts           # 组件类型定义
└── README.md          # 组件文档
```

### 3. **Hook 开发规范**
```typescript
// ✅ 推荐：Hook 结构
export function useCustomHook(options: UseCustomHookOptions = {}) {
  // 1. 状态定义
  const [state, setState] = useState();
  
  // 2. 副作用处理
  useEffect(() => {
    // 副作用逻辑
  }, []);
  
  // 3. 事件处理函数
  const handleAction = useCallback(() => {
    // 处理逻辑
  }, []);
  
  // 4. 返回值
  return {
    state,
    handleAction
  };
}
```

### 4. **类型定义规范**
```typescript
// ✅ 推荐：类型定义结构
// 基础接口
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// 扩展接口
export interface User extends BaseEntity {
  username: string;
  email?: string;
  roles?: string[];
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}
```

## 🚀 迁移步骤

1. **创建新的目录结构**
2. **移动和重命名文件**
3. **更新导入路径**
4. **统一导出文件**
5. **更新组件引用**
6. **测试功能完整性**

## 📝 注意事项

- 保持向后兼容性
- 逐步迁移，避免一次性大改动
- 确保所有导入路径正确更新
- 添加适当的类型定义
- 保持代码风格一致性 