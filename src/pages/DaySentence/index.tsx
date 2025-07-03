import React from "react";
import styles from "./index.module.css";
import { TableColumn, DaySentence } from "../../types";
import { useApi, useCrud, useMountAsyncEffect } from "../../hooks";
import { Card, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  getDaySentenceList,
  addDaySentence,
  updateDaySentence,
  deleteDaySentence,
} from "../../api/daySentence";
import {
  CommonTable,
  CommonTableButton,
  FormModal,
  DeleteModal,
  DaySentenceForm,
} from "../../components";

const DaySentences: React.FC = () => {
  const {
    data: daySentences,
    loading: daySentencesLoading,
    error: daySentencesError,
    execute: fetchDaySentences,
  } = useApi<DaySentence[]>(getDaySentenceList, {
    showError: false,
  });

  // 只在组件挂载时调用一次
  useMountAsyncEffect(fetchDaySentences);

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "作者", dataIndex: "auth" },
    { title: "每日一句", dataIndex: "day_sentence" },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_: any, record: DaySentence) => (
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
  } = useCrud<DaySentence>({
    createApi: addDaySentence,
    updateApi: updateDaySentence,
    deleteApi: deleteDaySentence,
    createSuccessMessage: "每日一句创建成功",
    updateSuccessMessage: "每日一句更新成功",
    deleteSuccessMessage: "每日一句删除成功",
    onSuccess: () => {
      // 操作成功后刷新列表
      fetchDaySentences();
    },
  });

  // 处理编辑
  function handleEdit(record: DaySentence) {
    showEditModal(record);
  }

  // 处理删除
  function handleDelete(record: DaySentence) {
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
      auth: currentRecord.auth,
      day_sentence: currentRecord.day_sentence,
    };
  };

  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增每日一句"
        onAdd={showCreateModal}
        title="每日一句管理"
        onReload={fetchDaySentences}
        loading={daySentencesLoading}
      />
      <Card style={{ borderRadius: 16 }}>
        <CommonTable
          onReload={fetchDaySentences}
          columns={columns as TableColumn[]}
          dataSource={daySentences || []}
          error={daySentencesError}
          loading={daySentencesLoading}
          pagination={{}}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <FormModal
        title={isEdit ? "编辑每日一句" : "新增每日一句"}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        width={600}
      >
        <DaySentenceForm />
      </FormModal>

      {/* 删除确认弹窗 */}
      <DeleteModal
        visible={deleteModalVisible}
        loading={crudLoading}
        recordName={currentRecord?.auth}
        onCancel={hideDeleteModal}
        onConfirm={handleDeleteConfirmAction}
      />
    </div>
  );
};

export default DaySentences;
