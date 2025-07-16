import React, { useState } from 'react';
import { Table, Card, Tree, Select, Button, Space, Popconfirm, message, Avatar, Form } from 'antd';
import styles from './index.module.css';
import { getComments, createComment, updateComment, deleteComment } from '../../api/comment';
import { CommentData, TableColumn, BlogData, authReducer } from '../../types';
import { getBlogs } from '../../api/blog';
import { useApi, useCrud, useInitialAsyncEffect } from '../../hooks';
import { FormModal, DeleteModal, ActionButtons, CommonTableButton, CommonTable } from '../../components';
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
  if (content.length <= 40) return <span style={{ color: '#222', fontWeight: 600 }}>{content}</span>;
  return (
    <>
      <span style={{ color: '#222', fontWeight: 600 }}>
        {expanded ? content : content.slice(0, 40) + '...'}
      </span>
      <a style={{ marginLeft: 8, fontSize: 12 }} onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}>
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
    map.set(comment.id!, { ...comment, key: comment.id, title: `[${comment.id}] ${comment.content?.slice(0, 30)}` });
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

// 头像emoji和渐变色
function getAvatarEmoji(userId: number) {
  const emojis = ['🦄', '🐱', '🐶', '🦊', '🐼', '🐧', '🐸', '🐵', '🦁', '🐯', '🐰', '🐻', '🐨', '🐔', '🐙', '🦉', '🦋', '🐳', '🐲', '🦖'];
  return emojis[userId % emojis.length];
}
function getAvatarGradient(userId: number) {
  const gradients = [
    'linear-gradient(135deg,#fbc2eb 0%,#a6c1ee 100%)',
    'linear-gradient(135deg,#fcb69f 0%,#ffdde1 100%)',
    'linear-gradient(135deg,#b2f7ef 0%,#f67280 100%)',
    'linear-gradient(135deg,#355c7d 0%,#6c5b7b 100%)',
    'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)',
    'linear-gradient(135deg,#43cea2 0%,#185a9d 100%)',
    'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)',
    'linear-gradient(135deg,#a1c4fd 0%,#c2e9fb 100%)',
    'linear-gradient(135deg,#fbc2eb 0%,#fcb69f 100%)',
    'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)',
  ];
  return gradients[userId % gradients.length];
}
// 趣味标签
function getFunTags(content: string) {
  const tags: string[] = [];
  if (/赞|棒|好|👍|nice|great|666|牛/.test(content)) tags.push('👍 赞');
  if (/吐槽|差|不行|👎|呵呵|无语/.test(content)) tags.push('😅 吐槽');
  if (/哈哈|笑|😂|😁/.test(content)) tags.push('😂 有趣');
  if (/支持|加油|冲/.test(content)) tags.push('💪 支持');
  if (/美|漂亮|帅|靓/.test(content)) tags.push('🌟 颜值');
  return tags;
}

const Comments: React.FC = () => {
  const { user } = useSelector((state: authReducer) => state.auth);
  const { data, loading, error, execute: fetchComments } = useApi<CommentData[]>(getComments, { showError: false });
  const { data: blogs, loading: blogsLoading, error: blogsError, execute: fetchBlogs } = useApi<BlogData[]>(getBlogs, { showError: false });
  useInitialAsyncEffect(fetchComments);
  useInitialAsyncEffect(fetchBlogs);

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
        editDisabled={!hasPermission('/blogsManage/comments', 'update')}
        deleteDisabled={!hasPermission('/blogsManage/comments', 'delete')}
      />
    ) }
  ];
  const [selectedBlogId, setSelectedBlogId] = useState<number | undefined>(undefined);
  const [form] = Form.useForm();

  // 只展示选中博客下的评论
  const filteredComments = selectedBlogId ? (data || []).filter(c => c.blog_id === selectedBlogId) : (data || []);


  return (
    <div className={styles.root}>
      <CommonTableButton
        addButtonText="新增评论"
        onAdd={showCreateModal}
        title="评论管理"
        onReload={fetchComments}
        loading={loading}
        operations={{
          create: hasPermission('/blogsManage/comments', 'create'),
          update: hasPermission('/blogsManage/comments', 'update'),
          delete: hasPermission('/blogsManage/comments', 'delete'),
          read: hasPermission('/blogsManage/comments', 'read'),
        }}
      />
      <Card style={{ borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 24, background: '#f6f8fa' }}>
        <div style={{ marginBottom: 24 }}>
          <Select
            style={{ width: 320, fontSize: 16 }}
            allowClear
            placeholder="请选择要查看的博客"
            value={selectedBlogId}
            onChange={setSelectedBlogId}
            options={blogs?.map(blog => ({ label: blog.title, value: blog.id }))}
          />
        </div>
        <Tree
          treeData={buildCommentTree(filteredComments)}
          defaultExpandAll
          showLine={false}
          style={{ background: 'transparent', padding: 8 }}
          titleRender={nodeData => (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 0, padding: '18px 24px', minHeight: 64, transition: 'box-shadow 0.2s, border 0.2s', gap: 16, border: '2px solid transparent', position: 'relative', marginTop: 18 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, flexDirection: 'row' }}>
                <Avatar size={40} style={{ background: getAvatarColor(nodeData.user_id), fontSize: 20, marginTop: 2 }}>
                  {String(nodeData.user_id).charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6, color: '#222', wordBreak: 'break-all' }}>
                    <FoldableContent content={nodeData.content} />
                  </div>
                  <div style={{ color: '#888', fontSize: 14, lineHeight: 1.7 }}>
                    <span>ID: {nodeData.id}</span>
                    <span style={{ marginLeft: 18 }}>用户ID: {nodeData.user_id}</span>
                    <span style={{ marginLeft: 18 }}>时间: {nodeData.created_at ? dayjs(nodeData.created_at).format('YYYY-MM-DD HH:mm') : '-'}</span>
                  </div>
                </div>
              </div>
              <Space size={12} style={{ marginTop: 2, flexWrap: 'wrap' }}>
                <Button
                  size="middle"
                  icon={<EditOutlined />}
                  style={{ color: '#3b82f6', borderColor: '#3b82f6', background: '#f0f7ff' }}
                  onClick={e => { e.stopPropagation(); handleEdit(nodeData); }}
                  disabled={!hasPermission('/blogsManage/comments', 'update')}
                />
                <Button
                  size="middle"
                  icon={<DeleteOutlined />}
                  danger
                  style={{ background: '#fff0f0', color: '#f43f5e', borderColor: '#f43f5e' }}
                  onClick={e => { e.stopPropagation(); handleDelete(nodeData); }}
                  disabled={!hasPermission('/blogsManage/comments', 'delete')}
                />
                <Button
                  size="middle"
                  type="primary"
                  ghost
                  style={{ borderRadius: 20, fontWeight: 500 }}
                  onClick={e => { e.stopPropagation(); handleReply(nodeData); }}
                  disabled={!hasPermission('/blogsManage/comments', 'create')}
                >回复</Button>
              </Space>
            </div>
          )}
        />
      </Card>
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
        <CommentForm blogs={blogs || []} comments={data || []} form={form} />
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