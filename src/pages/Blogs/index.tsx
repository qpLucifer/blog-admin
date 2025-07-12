import React from 'react';
import { Table, Card, Tag, Space } from 'antd';
import styles from './index.module.css';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../api/blog';
import { getTags } from '../../api/tag';
import { BlogData, TagData, TableColumn } from '../../types';
import { useApi, useCrud, useInitialAsyncEffect } from '../../hooks'; 
import { FormModal, DeleteModal, ActionButtons, CommonTableButton, CommonTable } from '../../components';
import BlogForm from '../../components/forms/BlogForm';
import { useMenuPermission } from '../../hooks/useMenuPermission';

const Blogs: React.FC = () => {
  const { data, loading, error, execute: fetchBlogs } = useApi<BlogData[]>(getBlogs, { showError: false });
  const { data: tags, loading: tagsLoading, error: tagsError, execute: fetchTags } = useApi<TagData[]>(getTags, { showError: true });

  useInitialAsyncEffect(fetchBlogs);
  useInitialAsyncEffect(fetchTags);

  const { hasPermission } = useMenuPermission();
  // 用法示例：
  // hasPermission('/blogs', 'create')
  // hasPermission('/blogs', 'update')
  // hasPermission('/blogs', 'delete')

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
  } = useCrud<BlogData>({
    createApi: createBlog,
    updateApi: updateBlog,
    deleteApi: deleteBlog,
    createSuccessMessage: '博客创建成功',
    updateSuccessMessage: '博客更新成功',
    deleteSuccessMessage: '博客删除成功',
    onSuccess: fetchBlogs
  });

  function handleEdit(record: BlogData) {
    showEditModal(record);
  }
  function handleDelete(record: BlogData) {
    showDeleteModal(record);
  }
  const handleSubmit = async (values: any) => {
    if (isEdit) {
      await handleUpdate(values);
    } else {
      values.author_id = 1;
      await handleCreate(values);
    }
  };
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm();
  };
  const getInitialValues = () => {
    if (!currentRecord) return {};
    return {
      ...currentRecord,
      tags: currentRecord.tags || [],
    };
  };

  const columns: TableColumn[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', width: 200 },
    { title: '标签', dataIndex: 'tags', width: 180, render: (tags: TagData[]) => (
      <Space>
        {tags?.map(tag => <Tag key={tag.id}>{tag.name}</Tag>) || '-'}
      </Space>
    ) },
    { title: '作者ID', dataIndex: 'author_id', width: 100 },
    { title: '发布状态', dataIndex: 'is_published', width: 100, render: (v: boolean) => (
      <Tag color={v ? 'green' : 'red'}>{v ? '已发布' : '未发布'}</Tag>
    ) },
    { title: '阅读量', dataIndex: 'views', width: 100 },
    { title: '点赞数', dataIndex: 'likes', width: 100 },
    { title: '评论数', dataIndex: 'comments_count', width: 100 },
    { title: '操作', key: 'action', dataIndex: "operation",width: 150, fixed: 'right', render: (_: any, record: BlogData) => (
      <ActionButtons
        record={record}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editDisabled={!hasPermission('/blogs', 'update')}
        deleteDisabled={!hasPermission('/blogs', 'delete')}
      />
    ) }
  ];

  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增博客"
        onAdd={showCreateModal}
        title="博客管理"
        onReload={fetchBlogs}
        loading={loading || tagsLoading}
        operations={{
          create: hasPermission('/blogs', 'create'),
          update: hasPermission('/blogs', 'update'),
          delete: hasPermission('/blogs', 'delete'),
          read: hasPermission('/blogs', 'read'),
        }}
      />
      <Card style={{ borderRadius: 16 }}>
        <CommonTable
          columns={columns}
          dataSource={data || []}
          rowKey="id"
          pagination={{}}
          loading={loading || tagsLoading}
          error={error || tagsError}
          scroll={{ x: 1000 }}
        />
      </Card>
      <FormModal
        title={isEdit ? '编辑博客' : '新增博客'}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        width={700}
      >
        <BlogForm isEdit={isEdit} tags={tags || []} />
      </FormModal>
      <DeleteModal
        visible={deleteModalVisible}
        loading={crudLoading}
        recordName={currentRecord?.title}
        onCancel={hideDeleteModal}
        onConfirm={handleDeleteConfirmAction}
      />
    </div>
  );
};

export default Blogs; 