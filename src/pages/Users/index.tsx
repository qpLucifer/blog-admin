import React, { useState } from 'react';
import { Space, Tag, Form, Input, Select } from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import { getUsersPage, createUser, updateUser, deleteUser, exportUsers } from '../../api/user';
import { getRolesAll } from '../../api/role';
import { User, Role, TableColumn } from '../../types';
import { useApi, useCrud, useInitialEffect } from '../../hooks';
import {
  FormModal,
  DeleteModal,
  ActionButtons,
  CommonTable,
  SearchCard,
  TableToolbar,
  TableContainer,
} from '../../components';
import UserForm from '../../components/forms/UserForm';
import { useMenuPermission } from '../../hooks/useMenuPermission';
import { createExportHandler } from '../../utils/exportUtils';
import { formatDateTime } from '../../utils/dateUtils';

interface UserWithRoles {
  roles: Role[];
}

const Users: React.FC = () => {
  const [form] = Form.useForm();
  const [searchCollapsed, setSearchCollapsed] = useState(false);

  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    pageSize: 10,
    username: '',
    email: '',
    is_active: undefined,
  });

  const {
    data,
    loading,
    error,
    execute: fetchUsers,
  } = useApi<{ list: User[]; total: number; pageSize: number; currentPage: number }>(
    () => getUsersPage(queryParams),
    { showError: false }
  );

  const {
    data: roles,
    loading: rolesLoading,
    error: rolesError,
    execute: fetchRoles,
  } = useApi<Role[]>(getRolesAll, {
    showError: true,
  });

  useInitialEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [
    queryParams.currentPage,
    queryParams.pageSize,
    queryParams.username,
    queryParams.email,
    queryParams.is_active,
  ]);

  const { hasPermission } = useMenuPermission();

  const {
    modalVisible,
    deleteModalVisible,
    loading: crudLoading,
    isEdit,
    currentRecord,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    hideModal,
    hideDeleteModal,
    handleCreate,
    handleUpdate,
    handleDelete: handleDeleteConfirm,
  } = useCrud<User>({
    createApi: createUser,
    updateApi: updateUser,
    deleteApi: deleteUser,
    createSuccessMessage: '用户创建成功',
    updateSuccessMessage: '用户更新成功',
    deleteSuccessMessage: '用户删除成功',
    onSuccess: fetchUsers,
  });

  // 创建导出处理函数
  const handleExport = createExportHandler({
    api: exportUsers as (params: any) => Promise<any>,
    filename: '用户列表',
    params: {
      username: queryParams.username || undefined,
      email: queryParams.email || undefined,
      is_active: queryParams.is_active,
    },
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

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    setQueryParams(prev => ({
      ...prev,
      currentPage: page,
      pageSize: pageSize,
    }));
  };

  // 处理搜索
  const onFinish = (values: any) => {
    setQueryParams(prev => ({
      ...prev,
      ...values,
      currentPage: 1,
    }));
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setQueryParams({
      currentPage: 1,
      pageSize: 10,
      username: '',
      email: '',
      is_active: undefined,
    });
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

  const columns: TableColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      render: (email: string) => email || '-',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      width: 150,
      render: (roles: UserWithRoles['roles']) => (
        <Space>
          {roles?.map(role => (
            <Tag key={role.id} color='blue'>
              {role.name}
            </Tag>
          )) || '-'}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (is_active: boolean) => (
        <span style={{ color: is_active ? '#52c41a' : '#ff4d4f' }}>
          {is_active ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      dataIndex: 'action',
      fixed: 'right' as const,
      render: (_: any, record: User) => (
        <ActionButtons
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editDisabled={!hasPermission('update')}
          deleteDisabled={!hasPermission('delete')}
        />
      ),
    },
  ];

  return (
    <div className={`${styles.root} ${pageStyles.pageContainer}`}>
      <div className={pageStyles.pageContent}>
        {/* 搜索区域 */}
        <SearchCard
          title='查询条件'
          form={form}
          onFinish={onFinish}
          onReset={handleReset}
          loading={loading}
          collapsed={searchCollapsed}
          onToggleCollapse={() => setSearchCollapsed(!searchCollapsed)}
        >
          <Form.Item name='username' label='用户名'>
            <Input allowClear placeholder='输入用户名' style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name='email' label='邮箱'>
            <Input allowClear placeholder='输入邮箱' style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name='is_active' label='状态'>
            <Select allowClear placeholder='选择状态' style={{ width: 120 }}>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </SearchCard>

        {/* 操作栏 */}
        <TableToolbar
          title='用户管理'
          showAdd={hasPermission('create')}
          addButtonText='新增用户'
          onAdd={showCreateModal}
          onReload={fetchUsers}
          loading={loading || rolesLoading}
          selectedRowKeys={[]}
          onExport={hasPermission('read') ? handleExport : undefined}
          operations={{
            create: hasPermission('create'),
            export: hasPermission('read'),
            batchDelete: hasPermission('delete'),
          }}
        />

        {/* 表格区域 */}
        <TableContainer loading={loading || rolesLoading}>
          <CommonTable
            columns={columns as TableColumn[]}
            dataSource={data?.list || []}
            rowKey='id'
            pagination={{
              total: data?.total || 0,
              current: data?.currentPage || 1,
              pageSize: data?.pageSize || 10,
              onChange: handleTableChange,
            }}
            loading={loading || rolesLoading}
            error={error || rolesError}
            scroll={{ x: 800 }}
          />
        </TableContainer>

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
          <UserForm roles={roles || []} isEdit={isEdit} />
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
    </div>
  );
};

export default Users;
