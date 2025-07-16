import React from 'react';
import { Table, Card } from 'antd';
import styles from './index.module.css';
import { getTags, createTag, updateTag, deleteTag } from '../../api/tag';
import { TagData, TableColumn } from '../../types';
import { useApi, useCrud, useInitialAsyncEffect } from '../../hooks';
import { FormModal, DeleteModal, ActionButtons, CommonTableButton, CommonTable } from '../../components';
import TagForm from '../../components/forms/TagForm';
import { useMenuPermission } from '../../hooks/useMenuPermission';

const Tags: React.FC = () => {
  const { data, loading, error, execute: fetchTags } = useApi<TagData[]>(getTags, { showError: false });
  useInitialAsyncEffect(fetchTags);
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
  } = useCrud<TagData>({
    createApi: createTag,
    updateApi: updateTag,
    deleteApi: deleteTag,
    createSuccessMessage: '标签创建成功',
    updateSuccessMessage: '标签更新成功',
    deleteSuccessMessage: '标签删除成功',
    onSuccess: fetchTags
  });
  function handleEdit(record: TagData) {
    showEditModal(record);
  }
  function handleDelete(record: TagData) {
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
    { title: '标签名', dataIndex: 'name', width: 200 },
    { title: '操作', key: 'action',dataIndex: "operation", width: 150, fixed: 'right', render: (_: any, record: TagData) => (
      <ActionButtons
        record={record}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editDisabled={!hasPermission('/blogsManage/tags', 'update')}
        deleteDisabled={!hasPermission('/blogsManage/tags', 'delete')}
      />
    ) }
  ];
  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增标签"
        onAdd={showCreateModal}
        title="标签管理"
        onReload={fetchTags}
        loading={loading}
        operations={{
          create: hasPermission('/blogsManage/tags', 'create'),
          update: hasPermission('/blogsManage/tags', 'update'),
          delete: hasPermission('/blogsManage/tags', 'delete'),
          read: hasPermission('/blogsManage/tags', 'read'),
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
          scroll={{ x: 600 }}
        />
      </Card>
      <FormModal
        title={isEdit ? '编辑标签' : '新增标签'}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        width={400}
      >
        <TagForm />
      </FormModal>
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

export default Tags; 