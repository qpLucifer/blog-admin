# 路由守卫组件 (Redux版本)

本项目使用Redux Toolkit实现了完整的前端状态管理，包括用户认证、权限控制和路由守卫。

## Redux Store结构

### 认证状态 (authSlice)

```typescript
interface AuthState {
  user: UserInfo | null;        // 用户信息
  token: string | null;         // 认证token
  isAuthenticated: boolean;     // 是否已认证
  loading: boolean;             // 加载状态
  error: string | null;         // 错误信息
}
```

## 组件说明

### 1. PrivateRoute - 私有路由守卫

用于保护需要登录才能访问的路由。

```tsx
import PrivateRoute from '../components/PrivateRoute';

<Route path="/dashboard" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
```

**功能：**
- 检查用户是否已登录（通过Redux状态验证）
- 如果未登录，重定向到登录页面
- 如果已登录，渲染子组件

### 2. PublicRoute - 公共路由守卫

用于处理已登录用户访问公共页面（如登录页）的情况。

```tsx
import PublicRoute from '../components/PublicRoute';

<Route path="/login" element={
  <PublicRoute>
    <Login />
  </PublicRoute>
} />
```

**功能：**
- 如果用户已登录，重定向到仪表板
- 如果用户未登录，渲染子组件

### 3. PermissionRoute - 权限路由守卫

用于检查用户是否有访问特定页面的权限。

```tsx
import PermissionRoute from '../components/PermissionRoute';

<Route path="/admin" element={
  <PermissionRoute requiredPermission="admin:access">
    <AdminPanel />
  </PermissionRoute>
} />
```

**功能：**
- 检查用户是否有所需权限
- 如果权限不足，重定向到指定页面
- 如果有权限，渲染子组件

## Redux Hooks

### 使用Redux状态

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  selectUser, 
  selectIsAuthenticated, 
  selectLoading,
  loginUser,
  logoutUser 
} from '../store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectLoading);

  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // 登录成功
    } catch (error) {
      // 登录失败
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // 登出成功
    } catch (error) {
      // 登出失败
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>欢迎, {user?.username}!</p>
          <button onClick={handleLogout}>登出</button>
        </div>
      ) : (
        <button onClick={() => handleLogin({ username: 'test', password: 'test' })}>
          登录
        </button>
      )}
    </div>
  );
};
```

## 认证工具函数

项目提供了两套认证工具函数：

### 1. Redux版本 (推荐) - `src/utils/authRedux.ts`

```typescript
import { 
  getToken, 
  isAuthenticated, 
  getUserInfo, 
  hasPermission, 
  hasRole 
} from '../utils/authRedux';

// 检查登录状态
const loggedIn = isAuthenticated();

// 获取用户信息
const user = getUserInfo();

// 检查权限
const canEdit = hasPermission('user:edit');

// 检查角色
const isAdmin = hasRole('admin');
```

### 2. 传统版本 - `src/utils/auth.ts`

基于localStorage的认证工具函数，已不推荐使用。

## 使用示例

### 基本路由配置

```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import PermissionRoute from './components/PermissionRoute';
import AuthInitializer from './components/AuthInitializer';

const AppRouter = () => (
  <Provider store={store}>
    <AuthInitializer />
    <Router>
      <Routes>
        {/* 公共路由 */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* 受保护的路由 */}
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          
          {/* 需要特定权限的路由 */}
          <Route path="admin" element={
            <PermissionRoute requiredPermission="admin:access">
              <AdminPanel />
            </PermissionRoute>
          } />
        </Route>
      </Routes>
    </Router>
  </Provider>
);
```

### 在组件中检查权限

```tsx
import React from 'react';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/authSlice';

const MyComponent = () => {
  const user = useAppSelector(selectUser);
  
  const canEdit = user?.permissions?.includes('user:edit') || false;
  const isAdmin = user?.roles?.includes('admin') || false;
  
  return (
    <div>
      {canEdit && <button>编辑</button>}
      {isAdmin && <button>管理员功能</button>}
    </div>
  );
};
```

### 登录页面示例

```tsx
import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, selectLoading, selectError, clearError } from '../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onFinish = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (error) {
      // 错误已在Redux中处理
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input placeholder="用户名" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {loading ? '登录中...' : '登录'}
        </Button>
      </Form.Item>
    </Form>
  );
};
```

## 状态持久化

Redux状态会自动与localStorage同步：

- **Token**: 自动保存到localStorage，页面刷新后恢复
- **用户信息**: 登录时保存到localStorage，页面刷新后恢复
- **权限信息**: 登录时保存到localStorage，页面刷新后恢复

## 注意事项

1. **状态管理**: 所有认证状态都通过Redux管理，确保状态一致性
2. **自动恢复**: 页面刷新后会自动从localStorage恢复认证状态
3. **错误处理**: 登录/登出错误会自动在Redux中处理并显示
4. **API拦截**: API请求会自动从Redux获取token，401错误会自动清除认证状态
5. **类型安全**: 使用TypeScript确保类型安全

## 扩展建议

1. **Token刷新**: 可以添加token过期检查和自动刷新机制
2. **权限缓存**: 可以添加权限缓存和定期同步机制
3. **动态路由**: 可以根据用户权限动态生成路由配置
4. **状态持久化**: 可以使用redux-persist进行更完善的状态持久化 

# 组件库说明

本项目包含了一系列可复用的组件，用于快速构建后台管理系统。

## 弹窗组件

### FormModal - 通用表单弹窗

用于新增和编辑操作的表单弹窗组件。

```tsx
import { FormModal } from '../components';
import { Input, Select } from 'antd';

const MyComponent = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 处理表单提交
      await submitData(values);
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      title="新增用户"
      visible={visible}
      loading={loading}
      onCancel={() => setVisible(false)}
      onSubmit={handleSubmit}
    >
      <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="邮箱" rules={[{ type: 'email' }]}>
        <Input />
      </Form.Item>
    </FormModal>
  );
};
```

### DeleteModal - 删除确认弹窗

用于删除操作的确认弹窗组件。

```tsx
import { DeleteModal } from '../components';

const MyComponent = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteRecord(record.id);
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteModal
      visible={visible}
      loading={loading}
      recordName={record?.name}
      onCancel={() => setVisible(false)}
      onConfirm={handleDelete}
    />
  );
};
```

## 操作组件

### ActionButtons - 操作按钮组

通用的编辑和删除按钮组件。

```tsx
import { ActionButtons } from '../components';

const MyComponent = () => {
  const handleEdit = (record: any) => {
    // 处理编辑
  };

  const handleDelete = (record: any) => {
    // 处理删除
  };

  return (
    <ActionButtons
      record={record}
      onEdit={handleEdit}
      onDelete={handleDelete}
      editText="编辑"
      deleteText="删除"
    />
  );
};
```

## CRUD Hook

### useCrud - CRUD 管理 Hook

用于管理新增、编辑、删除操作的状态和逻辑。

```tsx
import { useCrud } from '../hooks/useCrud';
import { createUser, updateUser, deleteUser } from '../api/user';

const UsersPage = () => {
  const {
    modalVisible,
    deleteModalVisible,
    loading,
    currentRecord,
    isEdit,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    hideModal,
    hideDeleteModal,
    handleCreate,
    handleUpdate,
    handleDelete
  } = useCrud({
    createApi: createUser,
    updateApi: updateUser,
    deleteApi: deleteUser,
    createSuccessMessage: '用户创建成功',
    updateSuccessMessage: '用户更新成功',
    deleteSuccessMessage: '用户删除成功',
    onSuccess: () => {
      // 操作成功后刷新列表
      fetchUsers();
    }
  });

  return (
    <div>
      <Button onClick={showCreateModal}>新增用户</Button>
      
      {/* 表格 */}
      <Table
        columns={[
          // ... 其他列
          {
            title: '操作',
            render: (_, record) => (
              <ActionButtons
                record={record}
                onEdit={showEditModal}
                onDelete={showDeleteModal}
              />
            )
          }
        ]}
      />

      {/* 新增/编辑弹窗 */}
      <FormModal
        title={isEdit ? '编辑用户' : '新增用户'}
        visible={modalVisible}
        loading={loading}
        initialValues={currentRecord}
        onCancel={hideModal}
        onSubmit={isEdit ? handleUpdate : handleCreate}
      >
        <UserForm isEdit={isEdit} />
      </FormModal>

      {/* 删除确认弹窗 */}
      <DeleteModal
        visible={deleteModalVisible}
        loading={loading}
        recordName={currentRecord?.username}
        onCancel={hideDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};
```

## 路由守卫组件

### PrivateRoute - 私有路由

用于保护需要登录才能访问的路由。

```tsx
import { PrivateRoute } from '../components';

<Route path="/dashboard" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
```

### PublicRoute - 公共路由

用于公共页面，已登录用户会被重定向。

```tsx
import { PublicRoute } from '../components';

<Route path="/login" element={
  <PublicRoute>
    <Login />
  </PublicRoute>
} />
```

### PermissionRoute - 权限路由

用于需要特定权限才能访问的路由。

```tsx
import { PermissionRoute } from '../components';

<Route path="/admin" element={
  <PermissionRoute requiredPermission="admin:access">
    <AdminPanel />
  </PermissionRoute>
} />
```

## 认证组件

### AuthInitializer - 认证初始化

用于初始化认证状态，通常在应用根组件中使用。

```tsx
import { AuthInitializer } from '../components';

const App = () => {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <Router>
        {/* 路由配置 */}
      </Router>
    </Provider>
  );
};
```

## 使用建议

1. **组件复用**：优先使用通用组件，减少重复代码
2. **类型安全**：使用 TypeScript 确保类型安全
3. **错误处理**：所有异步操作都应该有适当的错误处理
4. **用户体验**：提供加载状态和操作反馈
5. **权限控制**：合理使用权限守卫组件

## 扩展指南

如需添加新的通用组件：

1. 在 `src/components/` 目录下创建新组件
2. 添加 TypeScript 类型定义
3. 在 `src/components/index.ts` 中导出
4. 更新此文档说明使用方法 