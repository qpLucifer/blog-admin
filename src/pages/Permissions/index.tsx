import React from "react";
import styles from "./index.module.css";
import { Permission, TableColumn } from "../../types";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useApi, useCrud, useMountAsyncEffect } from "../../hooks";
import { Table, Button, Space, Card, Form, Tag } from "antd";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../../api/permissions";
import {
  CommonTable,
  CommonTableButton,
  FormModal,
  DeleteModal,
  PermissionForm,
} from "../../components";

const Permissions: React.FC = () => {
  const {
    data: permissions,
    loading: permissionsLoading,
    error: permissionsError,
    execute: fetchPermissions,
  } = useApi<Permission[]>(getPermissions, {
    showError: false,
  });

  // 只在组件挂载时调用一次
  useMountAsyncEffect(fetchPermissions);

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "权限名", dataIndex: "name" },
    { title: "描述", dataIndex: "description" },
    {
      title: "操作",
      dataIndex: "action",
      render: (_:any, record: Permission) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
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
  } = useCrud<Permission>({
    createApi: createPermission,
    updateApi: updatePermission,
    deleteApi: deletePermission,
    createSuccessMessage: "权限创建成功",
    updateSuccessMessage: "权限更新成功",
    deleteSuccessMessage: "权限删除成功",
    onSuccess: () => {
      // 操作成功后刷新列表
      fetchPermissions();
    },
  });

    // 处理编辑
    function handleEdit(record: Permission) {
      showEditModal(record);
    }
  
    // 处理删除
    function handleDelete(record: Permission) {
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
      };
    };



  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增权限"
        onAdd={showCreateModal}
        title="权限管理"
        onReload={fetchPermissions}
        loading={permissionsLoading}
      />
      <Card style={{ borderRadius: 16 }}>
        <CommonTable
          onReload={fetchPermissions}
          columns={columns as TableColumn[]}
          dataSource={permissions || []}
          error={permissionsError}
          loading={permissionsLoading}
          pagination={{}}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <FormModal
        title={isEdit ? "编辑权限" : "新增权限"}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        width={600}
      >
        <PermissionForm isEdit={isEdit} />
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

export default Permissions;
