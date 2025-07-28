# Types 模块化结构说明

本项目已将所有TypeScript类型定义按功能模块进行了重新组织，提高了代码的可维护性和可读性。

## 文件结构

```
src/types/
├── index.ts          # 统一导出文件
├── common.ts         # 通用基础类型
├── user.ts           # 用户相关类型
├── blog.ts           # 博客相关类型
├── api.ts            # API相关类型
├── component.ts      # 组件Props类型
└── README.md         # 本说明文件
```

## 各模块说明

### common.ts - 通用基础类型

包含项目中使用的通用类型定义：

- `BaseEntity` - 基础实体类型（包含id、created_at、updated_at）
- `PermissionType` - 权限类型别名
- `FormField` - 表单字段类型
- `TableColumn` - 表格列类型
- `PaginationParams` - 分页参数类型
- `OperationPermissions` - 操作权限类型
- `Option` - 选项类型
- `MenuItem` - 菜单项类型

### user.ts - 用户相关类型

包含用户、角色、权限、认证等相关类型：

- `User` - 用户基础信息
- `CreateUserData` / `UpdateUserData` - 用户CRUD数据类型
- `Role` - 角色信息
- `CreateRoleData` / `UpdateRoleData` - 角色CRUD数据类型
- `Permission` - 权限信息
- `CreatePermissionData` / `UpdatePermissionData` - 权限CRUD数据类型
- `UserInfo` - 用户详细信息（包含权限）
- `LoginCredentials` / `LoginResponse` - 登录相关类型
- `Menu` - 菜单信息
- `RoleMenu` - 角色菜单权限
- `CreateMenuData` / `UpdateMenuData` - 菜单CRUD数据类型
- `AuthState` / `AuthReducer` - 认证状态类型

### blog.ts - 博客相关类型

包含博客、标签、评论、每日一句等相关类型：

- `BlogData` - 博客数据
- `CreateBlogData` / `UpdateBlogData` - 博客CRUD数据类型
- `TagData` - 标签数据
- `CreateTagData` / `UpdateTagData` - 标签CRUD数据类型
- `CommentData` - 评论数据
- `CreateCommentData` / `UpdateCommentData` - 评论CRUD数据类型
- `DaySentence` - 每日一句数据
- `CreateDaySentenceData` / `UpdateDaySentenceData` - 每日一句CRUD数据类型
- `BlogQueryParams` / `TagQueryParams` / `CommentQueryParams` / `DaySentenceQueryParams` - 各种查询参数类型
- `CommentTreeNode` - 评论树节点类型
- `BlogStats` - 博客统计信息

### api.ts - API相关类型

包含API请求响应、分页等相关类型：

- `ApiResponse` - API响应基础类型
- `PaginatedResponse` / `ListResponse` - 分页响应类型
- `ErrorResponse` - 错误响应类型
- `UploadResponse` / `ExportResponse` - 文件操作响应类型
- `ApiConfig` - API请求配置类型
- `RequestParams` - 请求参数类型
- `UploadParams` - 文件上传参数类型
- `BatchOperationResponse` - 批量操作响应类型
- `StatsResponse` - 统计数据响应类型
- `SearchSuggestionResponse` - 搜索建议响应类型
- `ValidationResponse` - 验证响应类型

### component.ts - 组件Props类型

包含各种组件的Props接口定义：

- `FormModalProps` - 表单弹窗组件Props
- `DeleteModalProps` - 删除确认弹窗组件Props
- `ActionButtonsProps` - 操作按钮组件Props
- `CommonTableProps` - 通用表格组件Props
- `SearchCardProps` - 搜索卡片组件Props
- `TableToolbarProps` - 表格工具栏组件Props
- `TableContainerProps` - 表格容器组件Props
- `ErrorBoundaryProps` - 错误边界组件Props
- `UserFormProps` / `RoleFormProps` / `MenuFormProps` / `BlogFormProps` / `CommentFormProps` - 各种表单组件Props
- `IconSelectorProps` - 图标选择器组件Props
- `RouteLoadingProps` - 路由加载组件Props
- `PrivateRouteProps` / `PublicRouteProps` - 路由组件Props

## 使用方式

### 导入类型

```typescript
// 从统一导出文件导入（推荐）
import { BlogData, UserInfo, ApiResponse } from '../types';

// 从具体模块导入
import { BlogData } from '../types/blog';
import { UserInfo } from '../types/user';
import { ApiResponse } from '../types/api';
```

### 向后兼容

为了保持向后兼容性，原有的导入方式仍然有效：

```typescript
// 这种方式仍然可以正常工作
import { BlogData, UserInfo, TableColumn } from '../types';
```

## 优势

1. **模块化清晰** - 按功能模块组织，便于查找和维护
2. **减少耦合** - 相关类型集中管理，减少跨模块依赖
3. **提高可读性** - 每个文件职责单一，代码更易理解
4. **便于扩展** - 新增功能时可以轻松添加对应的类型模块
5. **向后兼容** - 保持原有导入方式的兼容性

## 注意事项

1. **避免循环依赖** - 各模块间应避免相互依赖
2. **统一导出** - 新增类型应在对应模块定义，并在index.ts中导出
3. **命名规范** - 保持一致的命名风格和约定
4. **文档更新** - 新增类型时应及时更新本文档

## 迁移指南

如果需要添加新的类型定义：

1. 确定类型所属的功能模块
2. 在对应的模块文件中添加类型定义
3. 在index.ts中添加导出
4. 更新相关组件的导入语句
5. 更新本文档说明

这种模块化的类型结构使得项目更加规范和易于维护，同时为未来的扩展提供了良好的基础。
