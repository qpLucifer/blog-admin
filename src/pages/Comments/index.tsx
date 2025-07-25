import React, { useState } from 'react';
import { Tree, Select, Space, Avatar, Form, Input, Button } from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import { getCommentsPage, createComment, updateComment, deleteComment } from '../../api/comment';
import { CommentData, BlogData, authReducer } from '../../types';
import { getBlogsAll } from '../../api/blog';
import { useApi, useCrud, useInitialEffect } from '../../hooks';
import { FormModal, DeleteModal, SearchCard, TableToolbar, TableContainer } from '../../components';
import CommentForm from '../../components/forms/CommentForm';
import { useMenuPermission } from '../../hooks/useMenuPermission';
import { useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// 生成头像颜色
function getAvatarColor(userId: number) {
  const colors = ['#a18cd1', '#fbc2eb', '#fcb69f', '#ffb347', '#b2f7ef', '#f67280', '#355c7d'];
  return colors[userId % colors.length];
}

// 评论内容折叠组件
const FoldableContent: React.FC<{ content: string }> = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  if (content.length <= 40)
    return <span style={{ color: '#222', fontWeight: 600 }}>{content}</span>;
  return (
    <>
      <span style={{ color: '#222', fontWeight: 600 }}>
        {expanded ? content : content.slice(0, 40) + '...'}
      </span>
      <a
        style={{ marginLeft: 8, fontSize: 12 }}
        onClick={e => {
          e.stopPropagation();
          setExpanded(v => !v);
        }}
      >
        {expanded ? '收起' : '展开'}
      </a>
    </>
  );
};

// 构建树形结构
function buildCommentTree(comments: CommentData[]): any[] {
  const map = new Map<number, any>();
  const roots: any[] = [];
  comments.forEach(comment => {
    map.set(comment.id!, {
      ...comment,
      key: comment.id,
      title: `[${comment.id}] ${comment.content?.slice(0, 30)}`,
    });
  });
  map.forEach(comment => {
    if (comment.parent_id && map.has(comment.parent_id)) {
      const parent = map.get(comment.parent_id);
      parent.children = parent.children || [];
      parent.children.push(comment);
    } else {
      roots.push(comment);
    }
  });
  return roots;
}

const Comments: React.FC = () => {
  const { user } = useSelector((state: authReducer) => state.auth);
  const [form] = Form.useForm();
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    pageSize: 10,
    content: '',
    user_id: '',
    blog_id: undefined,
  });

  const {
    data,
    loading,
    execute: fetchComments,
  } = useApi<{ list: CommentData[]; total: number; pageSize: number; currentPage: number }>(
    () => getCommentsPage(queryParams),
    { showError: false }
  );

  const { data: blogs, execute: fetchBlogs } = useApi<BlogData[]>(getBlogsAll, {
    showError: false,
  });

  useInitialEffect(() => {
    fetchComments();
  }, [
    queryParams.currentPage,
    queryParams.pageSize,
    queryParams.content,
    queryParams.user_id,
    queryParams.blog_id,
  ]);

  useInitialEffect(() => {
    fetchBlogs();
  }, []);

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
  } = useCrud<CommentData>({
    createApi: createComment,
    updateApi: updateComment,
    deleteApi: deleteComment,
    createSuccessMessage: '评论创建成功',
    updateSuccessMessage: '评论更新成功',
    deleteSuccessMessage: '评论删除成功',
    onSuccess: fetchComments,
  });
  function handleEdit(record: CommentData) {
    showEditModal(record);
  }
  function handleDelete(record: CommentData) {
    showDeleteModal(record);
  }
  const handleSubmit = async (values: any) => {
    values.user_id = user?.id;
    if (isEdit) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  };
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm();
  };
  const [replyParent, setReplyParent] = useState<CommentData | null>(null);
  // 回复按钮逻辑
  const handleReply = (comment: CommentData) => {
    setReplyParent(comment);
    showCreateModal();
  };
  // 新增/编辑/回复时，表单初始值
  const getInitialValues = () => {
    if (replyParent) {
      return { blog_id: replyParent.blog_id, parent_id: replyParent.id };
    }
    if (!currentRecord) return {};
    return { ...currentRecord };
  };
  // 新增/编辑/回复后重置replyParent
  const handleModalCancel = () => {
    hideModal();
    setReplyParent(null);
  };
  // // 处理分页变化
  // const handleTableChange = (page: number, pageSize: number) => {
  //   setQueryParams(prev => ({
  //     ...prev,
  //     currentPage: page,
  //     pageSize: pageSize,
  //   }));
  // };

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
      content: '',
      user_id: '',
      blog_id: undefined,
    });
  };

  // 评论数据（用于树形展示）
  const commentsData = data?.list || [];

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
          <Form.Item name='content' label='评论内容'>
            <Input allowClear placeholder='输入评论内容' style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name='user_id' label='用户ID'>
            <Input allowClear placeholder='输入用户ID' style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name='blog_id' label='博客'>
            <Select allowClear placeholder='选择博客' style={{ width: 200 }}>
              {blogs?.map(blog => (
                <Select.Option key={blog.id} value={blog.id}>
                  {blog.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </SearchCard>

        {/* 操作栏 */}
        <TableToolbar
          title='评论管理'
          showAdd={hasPermission('create')}
          addButtonText='新增评论'
          onAdd={showCreateModal}
          onReload={fetchComments}
          loading={loading}
          selectedRowKeys={[]}
          operations={{
            create: hasPermission('create'),
            export: hasPermission('read'),
          }}
        />

        {/* 表格区域 */}
        <TableContainer loading={loading}>
          <Tree
            treeData={buildCommentTree(commentsData)}
            defaultExpandAll
            showLine={false}
            style={{ background: 'transparent', padding: 8 }}
            titleRender={nodeData => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  marginBottom: 0,
                  padding: '18px 24px',
                  minHeight: 64,
                  transition: 'box-shadow 0.2s, border 0.2s',
                  gap: 16,
                  border: '2px solid transparent',
                  position: 'relative',
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexDirection: 'row',
                  }}
                >
                  <Avatar
                    size={40}
                    style={{
                      background: getAvatarColor(nodeData.user_id),
                      fontSize: 20,
                      marginTop: 2,
                    }}
                  >
                    {String(nodeData.user_id).charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 17,
                        marginBottom: 6,
                        color: '#222',
                        wordBreak: 'break-all',
                      }}
                    >
                      <FoldableContent content={nodeData.content} />
                    </div>
                    <div style={{ color: '#888', fontSize: 14, lineHeight: 1.7 }}>
                      <span>ID: {nodeData.id}</span>
                      <span style={{ marginLeft: 18 }}>用户ID: {nodeData.user_id}</span>
                      <span style={{ marginLeft: 18 }}>
                        时间:{' '}
                        {nodeData.created_at
                          ? dayjs(nodeData.created_at).format('YYYY-MM-DD HH:mm')
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                <Space size={12} style={{ marginTop: 2, flexWrap: 'wrap' }}>
                  <Button
                    size='middle'
                    icon={<EditOutlined />}
                    style={{ color: '#3b82f6', borderColor: '#3b82f6', background: '#f0f7ff' }}
                    onClick={e => {
                      e.stopPropagation();
                      handleEdit(nodeData);
                    }}
                    disabled={!hasPermission('update')}
                  />
                  <Button
                    size='middle'
                    icon={<DeleteOutlined />}
                    danger
                    style={{ background: '#fff0f0', color: '#f43f5e', borderColor: '#f43f5e' }}
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(nodeData);
                    }}
                    disabled={!hasPermission('delete')}
                  />
                  <Button
                    size='middle'
                    type='primary'
                    ghost
                    style={{ borderRadius: 20, fontWeight: 500 }}
                    onClick={e => {
                      e.stopPropagation();
                      handleReply(nodeData);
                    }}
                    disabled={!hasPermission('create')}
                  >
                    回复
                  </Button>
                </Space>
              </div>
            )}
          />
        </TableContainer>
      </div>
      <FormModal
        title={isEdit ? '编辑评论' : replyParent ? `回复评论(ID:${replyParent.id})` : '新增评论'}
        visible={modalVisible}
        loading={crudLoading}
        initialValues={getInitialValues()}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
        width={500}
        form={form}
      >
        <CommentForm blogs={blogs || []} comments={data?.list || []} form={form} />
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
