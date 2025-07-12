import React from 'react';
import { Table, Card } from 'antd';
import styles from './index.module.css';
import { getComments, createComment, updateComment, deleteComment } from '../../api/comment';
import { CommentData, TableColumn } from '../../types';
import { useApi, useCrud, useInitialAsyncEffect } from '../../hooks'; 
import { FormModal, DeleteModal, ActionButtons, CommonTableButton, CommonTable } from '../../components';
import CommentForm from '../../components/forms/CommentForm';
import { useMenuPermission } from '../../hooks/useMenuPermission';

const Comments: React.FC = () => {
  const { data, loading, error, execute: fetchComments } = useApi<CommentData[]>(getComments, { showError: false });
  useInitialAsyncEffect(fetchComments);
  const { hasPermission } = useMenuPermission();
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
  } = useCrud<CommentData>({
    createApi: createComment,
    updateApi: updateComment,
    deleteApi: deleteComment,
    createSuccessMessage: '评论创建成功',
    updateSuccessMessage: '评论更新成功',
    deleteSuccessMessage: '评论删除成功',
    onSuccess: fetchComments
  });
  function handleEdit(record: CommentData) {
    showEditModal(record);
  }
  function handleDelete(record: CommentData) {
    showDeleteModal(record);
  }
  const handleSubmit = async (values: any) => {
    if (isEdit) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  };
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm();
  };
  const getInitialValues = () => {
    if (!currentRecord) return {};
    return { ...currentRecord };
  };
  const columns: TableColumn[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '博客ID', dataIndex: 'blog_id', width: 100 },
    { title: '用户ID', dataIndex: 'user_id', width: 100 },
    { title: '内容', dataIndex: 'content', width: 300 },
    { title: '父评论ID', dataIndex: 'parent_id', width: 100 },
    { title: '操作', key: 'action', dataIndex: "operation", width: 150, fixed: 'right', render: (_: any, record: CommentData) => (
      <ActionButtons
        record={record}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editDisabled={!hasPermission('/comments', 'update')}
        deleteDisabled={!hasPermission('/comments', 'delete')}
      />
    ) }
  ];
  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增评论"
        onAdd={showCreateModal}
        title="评论管理"
        onReload={fetchComments}
        loading={loading}
        operations={{
          create: hasPermission('/comments', 'create'),
          update: hasPermission('/comments', 'update'),
          delete: hasPermission('/comments', 'delete'),
          read: hasPermission('/comments', 'read'),
        }}
      />
      <Card style={{ borderRadius: 16 }}>
        <CommonTable
          columns={columns}
          dataSource={data || []}
          rowKey="id"
          pagination={{}}
          loading={loading}
          error={error}
          scroll={{ x: 900 }}
        />
      </Card>
      <FormModal
        title={isEdit ? '编辑评论' : '新增评论'}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        width={500}
      >
        <CommentForm />
      </FormModal>
      <DeleteModal
        visible={deleteModalVisible}
        loading={crudLoading}
        recordName={currentRecord?.content}
        onCancel={hideDeleteModal}
        onConfirm={handleDeleteConfirmAction}
      />
    </div>
  );
};

export default Comments; 