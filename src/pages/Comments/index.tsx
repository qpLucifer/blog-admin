import React, { useState } from 'react';
import { Tree, Select, Avatar, Form, Input, Button, Tag, Tooltip, Typography, Card } from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import {
  getCommentsPage,
  createComment,
  updateComment,
  deleteComment,
  exportComments,
} from '../../api/comment';
import { CommentData, BlogData, authReducer } from '../../types';
import { getBlogsAll } from '../../api/blog';
import { useApi, useCrud, useInitialEffect } from '../../hooks';
import { FormModal, DeleteModal, SearchCard, TableToolbar, TableContainer } from '../../components';
import CommentForm from '../../components/forms/CommentForm';
import { useMenuPermission } from '../../hooks/useMenuPermission';
import { useSelector } from 'react-redux';
import {
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { createExportHandler } from '../../utils/exportUtils';

const { Text } = Typography;

// 生成头像颜色
function getAvatarColor(userId: number) {
  const colors = ['#a18cd1', '#fbc2eb', '#fcb69f', '#ffb347', '#b2f7ef', '#f67280', '#355c7d'];
  return colors[userId % colors.length];
}

// 获取博客标题
const getBlogTitle = (blogId: number, blogs: BlogData[] | null = []) => {
  const blog = blogs?.find(b => b.id === blogId);
  return blog?.title || `博客 #${blogId}`;
};

// 评论内容折叠组件
const FoldableContent: React.FC<{ content: string }> = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  if (content.length <= 60) return <Text style={{ color: '#333' }}>{content}</Text>;
  return (
    <>
      <Text style={{ color: '#333' }}>{expanded ? content : content.slice(0, 60) + '...'}</Text>
      <Button
        type='link'
        size='small'
        style={{ padding: 0, marginLeft: 8, fontSize: 12, height: 'auto' }}
        onClick={e => {
          e.stopPropagation();
          setExpanded(v => !v);
        }}
      >
        {expanded ? '收起' : '展开'}
      </Button>
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

  // 创建导出处理函数
  const handleExport = createExportHandler({
    api: exportComments as (params: any) => Promise<any>,
    filename: '评论列表',
    params: {
      content: queryParams.content || undefined,
      user_id: queryParams.user_id || undefined,
      blog_id: queryParams.blog_id || undefined,
    },
  });

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
          onExport={handleExport}
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
            style={{ background: 'transparent', padding: '8px 0' }}
            className={styles.commentTree}
            titleRender={nodeData => (
              <Card
                size='small'
                style={{
                  marginBottom: 8,
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                }}
                styles={{ body: { padding: '12px 16px' } }}
                hoverable
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {/* 头像 */}
                  <Avatar
                    size={32}
                    style={{
                      background: getAvatarColor(nodeData.user_id),
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                    icon={<UserOutlined />}
                  >
                    {String(nodeData.user_id).charAt(0).toUpperCase()}
                  </Avatar>

                  {/* 主要内容 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 博客标题标签 */}
                    <div style={{ marginBottom: 8 }}>
                      <Tag
                        color='blue'
                        style={{
                          fontSize: 12,
                          padding: '2px 8px',
                          borderRadius: 12,
                          border: 'none',
                        }}
                      >
                        <MessageOutlined style={{ marginRight: 4, fontSize: 11 }} />
                        {getBlogTitle(nodeData.blog_id, blogs)}
                      </Tag>
                    </div>

                    {/* 评论内容 */}
                    <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
                      <FoldableContent content={nodeData.content} />
                    </div>

                    {/* 元信息 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        fontSize: 12,
                        color: '#999',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span>
                        <UserOutlined style={{ marginRight: 4 }} />
                        用户 {nodeData.user_id}
                      </span>
                      <span>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {nodeData.created_at
                          ? dayjs(nodeData.created_at).format('MM-DD HH:mm')
                          : '-'}
                      </span>
                      <span>ID: {nodeData.id}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <Tooltip title='编辑'>
                      <Button
                        type='text'
                        size='small'
                        icon={<EditOutlined />}
                        onClick={e => {
                          e.stopPropagation();
                          handleEdit(nodeData);
                        }}
                        disabled={!hasPermission('update')}
                        style={{ color: '#1890ff' }}
                      />
                    </Tooltip>
                    <Tooltip title='删除'>
                      <Button
                        type='text'
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(nodeData);
                        }}
                        disabled={!hasPermission('delete')}
                        danger
                      />
                    </Tooltip>
                    <Tooltip title='回复'>
                      <Button
                        type='primary'
                        size='small'
                        onClick={e => {
                          e.stopPropagation();
                          handleReply(nodeData);
                        }}
                        disabled={!hasPermission('create')}
                        style={{ fontSize: 12, height: 24, padding: '0 8px' }}
                      >
                        回复
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </Card>
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
