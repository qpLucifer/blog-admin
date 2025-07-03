import React from "react";
import { Table, Button, Space, Card } from "antd";
import styles from "./index.module.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { User, TableColumn, Role, Menu } from "../../types";
import { useApi, useCrud, useMountAsyncEffect } from "../../hooks";
import {
  FormModal,
  DeleteModal,
  MenuForm,
  CommonTableButton,
  CommonTable,
  ActionButtons,
} from "../../components";
import { getMenuList, addMenu, updateMenu, deleteMenu } from "../../api/menu";

const Menus: React.FC = () => {
  const {
    data,
    loading,
    error,
    execute: fetchMenus,
  } = useApi<Menu[]>(getMenuList, {
    showError: false,
  });

  // 只在组件挂载时调用一次
  useMountAsyncEffect(fetchMenus);

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
  } = useCrud<Menu>({
    createApi: addMenu,
    updateApi: updateMenu,
    deleteApi: deleteMenu,
    createSuccessMessage: "菜单创建成功",
    updateSuccessMessage: "菜单更新成功",
    deleteSuccessMessage: "菜单删除成功",
    onSuccess: () => {
      // 操作成功后刷新列表
      fetchMenus();
    },
  });

  // 处理编辑
  function handleEdit(record: Menu) {
    showEditModal(record);
  }

  // 处理删除
  function handleDelete(record: Menu) {
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
      path: currentRecord.path,
      order: currentRecord.order,
      icon: currentRecord.icon,
    };
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "菜单名", dataIndex: "name" },
    { title: "路径", dataIndex: "path" },
    { title: "排序", dataIndex: "order" },
    { title: "图标", dataIndex: "icon" },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <ActionButtons
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];
  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增菜单"
        onAdd={showCreateModal}
        title="菜单管理"
        onReload={fetchMenus}
        loading={loading}
      />
      <Card style={{ borderRadius: 16 }}>
        <CommonTable
          columns={columns as TableColumn[]}
          dataSource={data || []}
          rowKey="id"
          pagination={{}}
          loading={loading}
          error={error}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <FormModal
        title={isEdit ? "编辑菜单" : "新增菜单"}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        width={600}
      >
        <MenuForm />
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

export default Menus;
