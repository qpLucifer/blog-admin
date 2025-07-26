import React, { useState } from 'react';
import { Form, Input } from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import { getTagsPage, createTag, updateTag, deleteTag, exportTags } from '../../api/tag';
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
import { createExportHandler } from '../../utils/exportUtils';

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

  useInitialEffect(() => {
    fetchTags();
  }, [queryParams.currentPage, queryParams.pageSize, queryParams.name]);

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
  } = useCrud<TagData>({
    createApi: createTag,
    updateApi: updateTag,
    deleteApi: deleteTag,
    createSuccessMessage: '标签创建成功',
    updateSuccessMessage: '标签更新成功',
    deleteSuccessMessage: '标签删除成功',
    onSuccess: fetchTags,
  });

  // 创建导出处理函数
  const handleExport = createExportHandler({
    api: exportTags as (params: any) => Promise<any>,
    filename: '标签列表',
    params: {
      name: queryParams.name || undefined,
    },
  });

  // 处理编辑
  function handleEdit(record: TagData) {
    showEditModal(record);
  }

  // 处理删除
  function handleDelete(record: TagData) {
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
    return { ...currentRecord };
  };

  const columns: TableColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标签名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'operation',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <ActionButtons
          record={record}
          onEdit={hasPermission('update') ? handleEdit : undefined}
          onDelete={hasPermission('delete') ? handleDelete : undefined}
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
          onExport={handleExport}
          loading={loading}
          selectedRowKeys={[]}
          operations={{
            create: hasPermission('create'),
            export: hasPermission('read'),
            batchDelete: hasPermission('delete'),
            import: hasPermission('create'),
          }}
        />

        {/* 表格区域 */}
        <TableContainer loading={loading}>
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
            loading={loading}
            error={error}
            scroll={{ x: 800 }}
          />
        </TableContainer>

        {/* 新增/编辑弹窗 */}
        <FormModal
          title={isEdit ? '编辑标签' : '新增标签'}
          visible={modalVisible}
          loading={crudLoading}
          initialValues={getInitialValues()}
          onCancel={hideModal}
          onSubmit={handleSubmit}
        >
          <TagForm />
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
    </div>
  );
};

export default Tags;
