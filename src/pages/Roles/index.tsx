import React from "react";
import { Card } from "antd";
import styles from "./index.module.css";
import { Role, TableColumn, Menu } from "../../types";
import { getRoles, createRole, updateRole, deleteRole } from "../../api/role";
import { getMenuList } from "../../api/menu";
import { useApi, useCrud, useInitialAsyncEffect, useMenuPermission } from "../../hooks";

import {
  CommonTable,
  CommonTableButton,
  FormModal,
  DeleteModal,
  RoleForm,
  ActionButtons,
} from "../../components";

const Roles: React.FC = () => {
  const {
    data,
    loading,
    error,
    execute: fetchRoles,
  } = useApi<Role[]>(getRoles, {
    showError: false,
  });

  const {
    data: menus,
    loading: menusLoading,
    error: menusError,
    execute: fetchMenus,
  } = useApi<Menu[]>(getMenuList, {
    showError: false,
  });

  // 只在组件挂载时调用一次
  useInitialAsyncEffect(fetchRoles);
  useInitialAsyncEffect(fetchMenus);

  const { hasPermission } = useMenuPermission();

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "角色名", dataIndex: "name" },
    { title: "描述", dataIndex: "description" },
    {
      title: "操作",
      key: "action",
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
    createSuccessMessage: "角色创建成功",
    updateSuccessMessage: "角色更新成功",
    deleteSuccessMessage: "角色删除成功",
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

  // 获取表单初始值
  const getInitialValues = () => {
    if (!currentRecord) return {};
    return {
      name: currentRecord.name,
      description: currentRecord.description,
      menus: currentRecord.menus?.map(
        (menu) => ({
          name: menu.name,
          menuId: menu.id,
          roleMenu: menu.roleMenu,
        })
      ),
    };
  };

  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增角色"
        onAdd={showCreateModal}
        title="角色管理"
        onReload={fetchRoles}
        loading={loading || menusLoading}
        operations={{
            create: hasPermission('create'),
            update: hasPermission('update'),
            delete: hasPermission('delete'),
            read: hasPermission('read'),
          }}
      />
      <Card style={{ borderRadius: 16 }}>
        <CommonTable
          onReload={fetchRoles}
          columns={columns as TableColumn[]}
          dataSource={data || []}
          error={error || menusError}
          loading={loading || menusLoading}
          pagination={{}}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <FormModal
        title={isEdit ? "编辑角色" : "新增角色"}
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
