import React, { useState } from 'react';
import { Form, Input } from 'antd';
import styles from './index.module.css';
import { Role, TableColumn, Menu } from '../../types';
import { getRolesPage, createRole, updateRole, deleteRole } from '../../api/role';
import { getMenuList } from '../../api/menu';
import { useApi, useCrud, useInitialEffect, useMenuPermission } from '../../hooks';

import {
  CommonTable,
  FormModal,
  DeleteModal,
  RoleForm,
  ActionButtons,
  SearchCard,
  TableToolbar,
  TableContainer,
} from '../../components';

const Roles: React.FC = () => {
  const [form] = Form.useForm();
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    pageSize: 10,
    name: '',
  });

  const {
    data,
    loading,
    error,
    execute: fetchRoles,
  } = useApi<{ list: Role[]; total: number; pageSize: number; currentPage: number }>(
    () => getRolesPage(queryParams),
    { showError: false }
  );

  const {
    data: menus,
    loading: menusLoading,
    error: menusError,
    execute: fetchMenus,
  } = useApi<Menu[]>(getMenuList, {
    showError: false,
  });

  // 当查询参数变化时重新获取数据
  useInitialEffect(() => {
    fetchRoles();
  }, [queryParams]);

  useInitialEffect(() => {
    fetchMenus();
  }, []);

  const { hasPermission } = useMenuPermission();

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '角色名', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
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
    handleDelete: handleDeleteConfirm,
  } = useCrud<Role>({
    createApi: createRole,
    updateApi: updateRole,
    deleteApi: deleteRole,
    createSuccessMessage: '角色创建成功',
    updateSuccessMessage: '角色更新成功',
    deleteSuccessMessage: '角色删除成功',
    onSuccess: () => {
      // 操作成功后刷新列表
      fetchRoles();
    },
  });

  // 处理编辑
  function handleEdit(record: Role) {
    showEditModal(record);
  }

  // 处理删除
  function handleDelete(record: Role) {
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
      name: '',
    });
  };

  // 获取表单初始值
  const getInitialValues = () => {
    if (!currentRecord) return {};
    return {
      name: currentRecord.name,
      description: currentRecord.description,
      menus: currentRecord.menus?.map(menu => ({
        name: menu.name,
        menuId: menu.id,
        roleMenu: menu.roleMenu,
      })),
    };
  };

  return (
    <div className={styles.root}>
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
        <Form.Item name='name' label='角色名'>
          <Input allowClear placeholder='输入角色名' style={{ width: 140 }} />
        </Form.Item>
      </SearchCard>

      {/* 操作栏 */}
      <TableToolbar
        title='角色管理'
        showAdd={hasPermission('create')}
        addButtonText='新增角色'
        onAdd={showCreateModal}
        onReload={fetchRoles}
        loading={loading || menusLoading}
        selectedRowKeys={[]}
        operations={{
          create: hasPermission('create'),
          export: hasPermission('read'),
        }}
      />

      {/* 表格区域 */}
      <TableContainer loading={loading || menusLoading}>
        <CommonTable
          onReload={fetchRoles}
          columns={columns as TableColumn[]}
          dataSource={data?.list || []}
          error={error || menusError}
          loading={loading || menusLoading}
          pagination={{
            total: data?.total || 0,
            current: data?.currentPage || 1,
            pageSize: data?.pageSize || 10,
            onChange: handleTableChange,
          }}
        />
      </TableContainer>

      {/* 新增/编辑弹窗 */}
      <FormModal
        title={isEdit ? '编辑角色' : '新增角色'}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        width={600}
      >
        <RoleForm isEdit={isEdit} menus={menus || []} />
      </FormModal>

      {/* 删除确认弹窗 */}
      <DeleteModal
        visible={deleteModalVisible}
        loading={crudLoading}
        recordName={currentRecord?.name}
        onCancel={hideDeleteModal}
        onConfirm={handleDeleteConfirmAction}
      />
    </div>
  );
};

export default Roles;
