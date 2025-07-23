import React, { useState } from 'react';
import { Card, Form, Input, Button } from 'antd';
import styles from './index.module.css';
import { getTags, createTag, updateTag, deleteTag } from '../../api/tag';
import { TagData, TableColumn } from '../../types';
import { useApi, useCrud, useInitialEffect } from '../../hooks';
import {
  FormModal,
  DeleteModal,
  ActionButtons,
  CommonTableButton,
  CommonTable,
} from '../../components';
import TagForm from '../../components/forms/TagForm';
import { useMenuPermission } from '../../hooks/useMenuPermission';

const Tags: React.FC = () => {
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState({ currentPage: 1, pageSize: 10, name: '' });
  const {
    data,
    loading,
    error,
    execute: fetchTags,
  } = useApi<{ list: TagData[]; total: number; pageSize: number; currentPage: number }>(
    () => getTags(queryParams),
    { showError: false }
  );
  // useInitialAsyncEffect(fetchTags);
  useInitialEffect(() => {
    fetchTags();
  }, [queryParams]);
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
    handleDelete: handleDeleteConfirm,
  } = useCrud<TagData>({
    createApi: createTag,
    updateApi: updateTag,
    deleteApi: deleteTag,
    createSuccessMessage: '标签创建成功',
    updateSuccessMessage: '标签更新成功',
    deleteSuccessMessage: '标签删除成功',
    onSuccess: fetchTags,
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

  const handleTableChange = (page: number, pageSize: number) => {
    setQueryParams(prev => ({
      ...prev,
      currentPage: page,
      pageSize: pageSize,
    }));
  };

  // 查询
  const onFinish = (values: any) => {
    setQueryParams(prev => ({
      ...prev,
      ...values,
      currentPage: 1,
    }));
  };
  // 重置
  const handleReset = () => {
    form.resetFields();
    setQueryParams({ currentPage: 1, pageSize: 10, name: '' });
  };

  const columns: TableColumn[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标签名', dataIndex: 'name', width: 200 },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'operation',
      width: 150,
      fixed: 'right',
      render: (_: any, record: TagData) => (
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
    <div className={styles.root}>
      <Form
        form={form}
        layout='inline'
        onFinish={onFinish}
        initialValues={{ title: '', is_published: undefined, is_choice: undefined, author_id: '' }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
      >
        <Form.Item name='name' label='标签名'>
          <Input allowClear placeholder='输入标签名' style={{ width: 140 }} />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleReset}>重置</Button>
        </Form.Item>
      </Form>
      <CommonTableButton
        addButtonText='新增标签'
        onAdd={showCreateModal}
        title='标签管理'
        onReload={fetchTags}
        loading={loading}
        operations={{
          create: hasPermission('create'),
          update: hasPermission('update'),
          delete: hasPermission('delete'),
          read: hasPermission('read'),
        }}
      />
      <Card style={{ borderRadius: 16 }}>
        <CommonTable
          columns={columns}
          dataSource={data?.list || []}
          rowKey='id'
          pagination={{
            total: data?.total || 0,
            current: data?.currentPage || 1,
            pageSize: data?.pageSize || 10,
            onChange: handleTableChange,
          }}
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
