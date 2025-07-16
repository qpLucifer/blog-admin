import React from 'react';
import { Card, Tag, Space } from 'antd';
import styles from './index.module.css';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../api/blog';
import { BlogData, TagData, TableColumn } from '../../types';
import { useApi, useCrud, useInitialAsyncEffect } from '../../hooks';
import { DeleteModal, ActionButtons, CommonTable, CommonTableButton } from '../../components';
import { useMenuPermission } from '../../hooks/useMenuPermission';
import { useNavigate } from 'react-router-dom';

const Blogs: React.FC = () => {
  const { data, loading, error, execute: fetchBlogs } = useApi<BlogData[]>(getBlogs, { showError: false });

  useInitialAsyncEffect(fetchBlogs);

  const { hasPermission } = useMenuPermission();
  const navigate = useNavigate();

  const {
    deleteModalVisible,
    loading: crudLoading,
    currentRecord,
    showDeleteModal,
    hideDeleteModal,
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
    navigate(`/blogsManage/blogs/edit/${record.id}`);
  }
  function handleDelete(record: BlogData) {
    showDeleteModal(record);
  }
  const handleAdd = () => {
    navigate('/blogsManage/blogs/edit');
  };
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm();
  };

  const columns: TableColumn[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', width: 200 },
    {
      title: '标签', dataIndex: 'tags', width: 180, render: (tags: TagData[]) => (
        <Space>
          {tags?.map(tag => <Tag key={tag.id}>{tag.name}</Tag>) || '-'}
        </Space>
      )
    },
    { title: '作者ID', dataIndex: 'author_id', width: 100 },
    {
      title: '发布状态', dataIndex: 'is_published', width: 100, render: (v: boolean) => (
        <Tag color={v ? 'green' : 'red'}>{v ? '已发布' : '未发布'}</Tag>
      )
    },
    { title: '阅读量', dataIndex: 'views', width: 100 },
    { title: '点赞数', dataIndex: 'likes', width: 100 },
    { title: '评论数', dataIndex: 'comments_count', width: 100 },
    {
      title: '操作', key: 'action', dataIndex: "operation", width: 150, fixed: 'right', render: (_: any, record: BlogData) => (
        <ActionButtons
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editDisabled={!hasPermission('/blogsManage/blogs', 'update')}
          deleteDisabled={!hasPermission('/blogsManage/blogs', 'delete')}
        />
      )
    }
  ];

  return (
    <div className={styles.root}>
      {/* 顶部统计区块 */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{data?.length || 0}</div>
          <div className={styles.statLabel}>博客总数</div>
        </div>
        <CommonTableButton
          addButtonText="新增博客"
          onAdd={handleAdd}
          onReload={fetchBlogs}
          loading={loading}
          operations={{
            create: hasPermission('/blogsManage/blogs', 'create'),
            update: hasPermission('/blogsManage/blogs', 'update'),
            delete: hasPermission('/blogsManage/blogs', 'delete'),
            read: hasPermission('/blogsManage/blogs', 'read'),
          }}
        />
      </div>
      <Card style={{ borderRadius: 16, marginTop: 16 }}>
        <CommonTable
          columns={columns}
          dataSource={data || []}
          rowKey="id"
          pagination={{}}
          loading={loading}
          error={error}
          scroll={{ x: 1000 }}
        />
      </Card>
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