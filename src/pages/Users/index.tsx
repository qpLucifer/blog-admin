import React from 'react';
import { Table, Button, Space, Card, Empty, Spin, Tag } from 'antd';
import styles from './index.module.css';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/user';
import { getRoles } from '../../api/role';
import { User, TableColumn, Role } from '../../types';
import { useApi, useCrud, useInitialAsyncEffect } from '../../hooks';
import { FormModal, DeleteModal, ActionButtons, UserForm, CommonTableButton, CommonTable } from '../../components';
import { useMenuPermission } from '../../hooks/useMenuPermission';

interface UserWithRoles {
  roles: Role[];
}

const Users: React.FC = () => {
  const { data, loading, error, execute: fetchUsers } = useApi<User[]>(getUsers, {
    showError: false,
  });

  const { data: roles, loading: rolesLoading, error: rolesError, execute: fetchRoles } = useApi<Role[]>(getRoles, {
    showError: true,
  });

   // 只在组件挂载时调用一次
   useInitialAsyncEffect(fetchUsers);
   useInitialAsyncEffect(fetchRoles);

   const { hasPermission } = useMenuPermission();
  // 用法示例：
  // hasPermission('/users', 'create')
  // hasPermission('/users', 'update')
  // hasPermission('/users', 'delete')

  // CRUD 管理
  const {
    modalVisible,
    deleteModalVisible,
    loading: crudLoading,
    currentRecord,
    isEdit,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    hideModal,
    hideDeleteModal,
    handleCreate,
    handleUpdate,
    handleDelete: handleDeleteConfirm
  } = useCrud<User>({
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

  // 处理编辑
  function handleEdit(record: User) {
    showEditModal(record);
  }

  // 处理删除
  function handleDelete(record: User) {
    showDeleteModal(record);
  }

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    if (isEdit) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  };

  // 处理删除确认
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm();
  };

  // 获取表单初始值
  const getInitialValues = () => {
    if (!currentRecord) return {};
    return {
      username: currentRecord.username,
      email: currentRecord.email,
      roles: currentRecord?.roles?.map(role => role.id),
      is_active: currentRecord.is_active,
    };
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', width: 120 },
    { 
      title: '邮箱', 
      dataIndex: 'email', 
      width: 200,
      render: (email: string) => email || '-'
    },
    { 
      title: '角色', 
      dataIndex: 'roles', 
      width: 150,
      render: (roles: UserWithRoles['roles']) => (
        <Space>
          {roles?.map(role => (
            <Tag key={role.id} color="blue">{role.name}</Tag>
          )) || '-'}
        </Space>
      )
    },
    { 
      title: '状态', 
      dataIndex: 'is_active', 
      width: 100,
      render: (status: number) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: User) => (
        <ActionButtons
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editDisabled={!hasPermission('/users', 'update')}
          deleteDisabled={!hasPermission('/users', 'delete')}
        />
      )
    }
  ];

  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增用户"
        onAdd={showCreateModal}
        title="用户管理"
        onReload={fetchUsers}
        loading={loading || rolesLoading}
        operations={{
          create: hasPermission('/users', 'create'),
          update: hasPermission('/users', 'update'),
          delete: hasPermission('/users', 'delete'),
          read: hasPermission('/users', 'read'),
        }}
      />
      <Card style={{ borderRadius: 16 }}>
        <CommonTable
          columns={columns as TableColumn[]}
          dataSource={data || []}
          rowKey="id"
          pagination={{}}
          loading={loading || rolesLoading}
          error={error || rolesError}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <FormModal
        title={isEdit ? '编辑用户' : '新增用户'}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        width={600}
      >
        <UserForm isEdit={isEdit} roles={roles || []} />
      </FormModal>

      {/* 删除确认弹窗 */}
      <DeleteModal
        visible={deleteModalVisible}
        loading={crudLoading}
        recordName={currentRecord?.username}
        onCancel={hideDeleteModal}
        onConfirm={handleDeleteConfirmAction}
      />
    </div>
  );
};

export default Users; 