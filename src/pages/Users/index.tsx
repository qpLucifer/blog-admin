import React from 'react';
import { Table, Button, Space, Card, Empty, Spin, Tag } from 'antd';
import styles from './index.module.css';
import { UserAddOutlined, ReloadOutlined } from '@ant-design/icons';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/user';
import { User } from '../../types';
import { useApi, useCrud, useMountAsyncEffect } from '../../hooks';
import { FormModal, DeleteModal, ActionButtons, UserForm } from '../../components';

// 模拟角色数据，实际项目中应该从API获取
const mockRoles = [
  { id: 1, name: '管理员' },
  { id: 2, name: '编辑' },
  { id: 3, name: '访客' }
];

interface Role {
  id: number;
  name: string;
}

interface UserWithRoles {
  roles: Role[];
}

const Users: React.FC = () => {
  const { data, loading, error, execute: fetchUsers } = useApi<User[]>(getUsers, {
    showError: false,
  });

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

  // 只在组件挂载时调用一次
  useMountAsyncEffect(fetchUsers);

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
      role_ids: currentRecord.roles?.map(role => 
        mockRoles.find(r => r.name === role)?.id
      ).filter(Boolean),
      status: currentRecord.status === 1
    };
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', width: 120 },
    // { 
    //   title: '邮箱', 
    //   dataIndex: 'email', 
    //   width: 200,
    //   render: (email: string) => email || '-'
    // },
    { 
      title: '角色', 
      dataIndex: 'Roles', 
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
      dataIndex: 'status', 
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
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
        />
      )
    }
  ];

  // 渲染表格内容
  const renderTable = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>加载中...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Empty 
            description={
              <div>
                <div style={{ color: '#ff4d4f', marginBottom: 8 }}>加载失败</div>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: 16 }}>{error}</div>
                <Button type="primary" icon={<ReloadOutlined />} onClick={fetchUsers}>
                  重新加载
                </Button>
              </div>
            }
          />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Empty 
          description="暂无用户数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
        }}
        loading={loading}
        scroll={{ x: 800 }}
      />
    );
  };

  return (
    <div className={styles.root}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className={styles.title}>用户管理</h2>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchUsers}
            loading={loading}
          >
            刷新
          </Button>
          <Button type="primary" icon={<UserAddOutlined />} onClick={showCreateModal}>
            新增用户
          </Button>
        </Space>
      </div>
      
      <Card style={{ borderRadius: 16 }}>
        {renderTable()}
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
        <UserForm isEdit={isEdit} roles={mockRoles} />
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