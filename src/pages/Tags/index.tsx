import React, { useState } from 'react';
import { Form, Input } from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import { getTagsPage, createTag, updateTag, deleteTag } from '../../api/tag';
import { TagData, TableColumn } from '../../types';
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
import TagForm from '../../components/forms/TagForm';
import { useMenuPermission } from '../../hooks/useMenuPermission';

const Tags: React.FC = () => {
  const [form] = Form.useForm();
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [queryParams, setQueryParams] = useState({ currentPage: 1, pageSize: 10, name: '' });
  const {
    data,
    loading,
    error,
    execute: fetchTags,
  } = useApi<{ list: TagData[]; total: number; pageSize: number; currentPage: number }>(
    () => getTagsPage(queryParams),
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
          <Form.Item name='name' label='标签名'>
            <Input allowClear placeholder='输入标签名' style={{ width: 140 }} />
          </Form.Item>
        </SearchCard>

        {/* 操作栏 */}
        <TableToolbar
          title='标签管理'
          showAdd={hasPermission('create')}
          addButtonText='新增标签'
          onAdd={showCreateModal}
          onReload={fetchTags}
          loading={loading}
          selectedRowKeys={[]}
          operations={{
            create: hasPermission('create'),
            export: hasPermission('read'),
          }}
        />

        {/* 表格区域 */}
        <TableContainer loading={loading}>
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
        </TableContainer>
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
    </div>
  );
};

export default Tags;
