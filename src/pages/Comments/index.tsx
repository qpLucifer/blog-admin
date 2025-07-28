import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Select,
  Avatar,
  Form,
  Input,
  Button,
  Tag,
  Tooltip,
  Space,
  Drawer,
  Descriptions,
  Spin,
} from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import {
  getCommentsPage,
  createComment,
  updateComment,
  deleteComment,
  exportComments,
} from '../../api/comment';
import {
  CommentData,
  BlogData,
  TableColumn,
  authReducer,
  CommentQueryParams,
  ListResponse,
  User,
} from '../../types';
import { getBlogsAll } from '../../api/blog';
import { getUsersAll } from '../../api/user';
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
  EyeOutlined,
  CommentOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { createExportHandler } from '../../utils/exportUtils';

const Comments: React.FC = () => {
  const { user } = useSelector((state: authReducer) => state.auth);
  const [searchForm] = Form.useForm(); // 搜索表单
  const [crudForm] = Form.useForm(); // CRUD表单
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(null);
  const [replyParentId, setReplyParentId] = useState<number | null>(null);
  const [replyParentComment, setReplyParentComment] = useState<CommentData | null>(null);
  const [queryParams, setQueryParams] = useState<CommentQueryParams>({
    currentPage: 1,
    pageSize: 10,
    content: '',
    user_id: '',
    blog_id: undefined,
  });

  // 获取主评论数据（只获取主评论用于表格显示）
  const {
    data,
    loading,
    execute: fetchComments,
  } = useApi<ListResponse<CommentData>>(
    () => {
      const params = {
        ...queryParams,
        parent_id: 'main', // 使用'main'表示获取主评论
      };
      return getCommentsPage(params);
    },
    { showError: false }
  );

  const { data: blogs, execute: fetchBlogs } = useApi<BlogData[]>(getBlogsAll, {
    showError: false,
  });

  // 获取用户数据
  const { data: users, execute: fetchUsers } = useApi<User[]>(getUsersAll, {
    showError: false,
  });

  // 获取所有评论（用于父评论选择，不分页）
  const { data: allComments, execute: fetchAllComments } = useApi<{ list: CommentData[] }>(
    () =>
      getCommentsPage({
        currentPage: 1,
        pageSize: 1000,
        content: '',
        user_id: '',
        blog_id: undefined,
      }),
    { showError: false }
  );

  // 存储每个主评论的回复数据
  const [repliesMap, setRepliesMap] = useState<Record<number, CommentData[]>>({});
  // 存储正在加载回复的评论ID
  const [loadingReplies, setLoadingReplies] = useState<Set<number>>(new Set());
  // 存储子评论的展开状态
  const [expandedSubReplies, setExpandedSubReplies] = useState<Set<number>>(new Set());

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
    fetchUsers();
  }, []);

  useInitialEffect(() => {
    fetchAllComments();
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
    onSuccess: action => {
      fetchComments(); // 刷新主评论列表
      fetchAllComments(); // 刷新表单选择数据
      // 清空回复缓存，强制重新加载
      setRepliesMap({});

      // 只在创建时清除回复状态和表单
      if (action === 'create') {
        setReplyParentId(null);
        setReplyParentComment(null);
        crudForm.resetFields();
      }
    },
  });
  const handleSubmit = async (values: any) => {
    values.user_id = user?.id;

    // 如果是回复，确保parent_id和blog_id正确
    if (replyParentId && replyParentComment) {
      values.parent_id = replyParentId;
      values.blog_id = replyParentComment.blog_id; // 继承父评论的博客ID
    }

    if (isEdit) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
      // 创建成功后清除回复状态和表单
      setReplyParentId(null);
      setReplyParentComment(null);
      crudForm.resetFields();
    }
  };
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
    searchForm.resetFields();
    setQueryParams({
      currentPage: 1,
      pageSize: 10,
      content: '',
      user_id: '',
      blog_id: undefined,
    });
  };

  // 查看评论详情
  const handleViewDetail = (comment: CommentData) => {
    setSelectedComment(comment);
    setDetailDrawerVisible(true);
  };

  // // 获取评论状态标签
  // const getStatusTag = (comment: CommentData) => {
  //   if (comment.parent_id) {
  //     return <Tag color='blue'>回复</Tag>;
  //   }
  //   return <Tag color='green'>评论</Tag>;
  // };

  // 获取博客标题
  const getBlogTitle = (blogId: number) => {
    const blog = blogs?.find(b => b.id === blogId);
    return blog?.title || '未知博客';
  };

  // 获取用户名称
  const getUserName = (userId: number) => {
    const user = users?.find(u => u.id === userId);
    return user?.username || `用户 ${userId}`;
  };

  // 处理回复评论
  const handleReply = (comment: CommentData) => {
    // 设置回复的父评论ID和相关信息
    setReplyParentId(comment.id || null);
    setReplyParentComment(comment);

    showCreateModal();
  };

  // 获取指定主评论的所有回复（按需加载，包括多层嵌套）
  const fetchRepliesForComment = async (parentId: number) => {
    if (repliesMap[parentId] || loadingReplies.has(parentId)) {
      return; // 已经加载过了或正在加载
    }

    // 设置加载状态
    setLoadingReplies(prev => new Set(prev).add(parentId));

    try {
      // 获取该主评论下的所有回复（包括多层嵌套）
      // 我们从allComments中过滤出属于这个主评论的所有回复
      const allCommentsResponse = allComments?.list || [];

      // 找出所有属于这个主评论的回复（递归查找）
      const findAllRepliesForMainComment = (mainCommentId: number): CommentData[] => {
        const result: CommentData[] = [];
        const visited = new Set<number>();

        const findReplies = (parentId: number) => {
          allCommentsResponse.forEach(comment => {
            if (comment.parent_id === parentId && !visited.has(comment.id!)) {
              visited.add(comment.id!);
              result.push(comment);
              // 递归查找这个回复的回复
              if (comment.id) {
                findReplies(comment.id);
              }
            }
          });
        };

        findReplies(mainCommentId);
        return result;
      };

      const allReplies = findAllRepliesForMainComment(parentId);

      setRepliesMap(prev => ({
        ...prev,
        [parentId]: allReplies,
      }));
    } catch (error) {
      console.error('获取回复失败:', error);
      // 加载失败时也要设置空数组，避免重复请求
      setRepliesMap(prev => ({
        ...prev,
        [parentId]: [],
      }));
    } finally {
      // 清除加载状态
      setLoadingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(parentId);
        return newSet;
      });
    }
  };

  // 获取指定评论的所有回复（从缓存中获取）
  const getAllReplies = (commentId: number | undefined): CommentData[] => {
    if (!commentId) return [];
    return repliesMap[commentId] || [];
  };

  // 获取指定评论的直接回复
  const getDirectReplies = (parentId: number, allReplies: CommentData[]): CommentData[] => {
    return allReplies.filter(reply => reply.parent_id === parentId);
  };

  // 切换子评论展开状态
  const toggleSubReplyExpand = (commentId: number) => {
    setExpandedSubReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // 递归渲染回复组件
  const renderReply = (
    reply: CommentData,
    allReplies: CommentData[],
    depth = 0
  ): React.ReactNode => {
    const directChildren = getDirectReplies(reply.id!, allReplies);
    const hasChildren = directChildren.length > 0;
    const isExpanded = expandedSubReplies.has(reply.id!);

    return (
      <div key={reply.id} style={{ marginLeft: depth * 20 }}>
        <div className={styles.replyItem}>
          <div className={styles.replyContent}>
            <div className={styles.replyText}>{reply.content}</div>
            <div className={styles.replyMeta}>
              <span className={styles.replyUser}>
                <UserOutlined /> {getUserName(reply.user_id)}
              </span>
              <span className={styles.replyTime}>
                {dayjs(reply.created_at).format('MM-DD HH:mm')}
              </span>
              {reply.parent_id && (
                <span className={styles.replyRelation}>
                  回复: {getReplyTargetContent(reply.parent_id)}
                </span>
              )}
              {hasChildren && (
                <Button
                  type='link'
                  size='small'
                  onClick={() => toggleSubReplyExpand(reply.id!)}
                  style={{ padding: 0, marginLeft: 8 }}
                >
                  {isExpanded ? '收起' : `展开 ${directChildren.length} 条回复`}
                </Button>
              )}
            </div>
          </div>
          <div className={styles.replyActions}>
            <Space size='small'>
              {hasPermission('create') && (
                <Button type='link' size='small' onClick={() => handleReply(reply)}>
                  回复
                </Button>
              )}
              {hasPermission('update') && (
                <Button
                  type='link'
                  size='small'
                  onClick={() => {
                    setReplyParentId(null);
                    setReplyParentComment(null);
                    showEditModal(reply);
                  }}
                >
                  编辑
                </Button>
              )}
              {hasPermission('delete') && (
                <Button type='link' size='small' danger onClick={() => showDeleteModal(reply)}>
                  删除
                </Button>
              )}
            </Space>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.subReplies}>
            {directChildren.map(child => renderReply(child, allReplies, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // 获取被回复评论的内容片段
  const getReplyTargetContent = (parentId: number | undefined): string => {
    if (!parentId) return '';

    // 先从主评论中查找
    const mainComment = mainCommentsData.find(comment => comment.id === parentId);
    if (mainComment) {
      return (
        mainComment.content?.slice(0, 20) +
          (mainComment.content && mainComment.content.length > 20 ? '...' : '') || ''
      );
    }

    // 再从所有回复缓存中查找
    for (const replies of Object.values(repliesMap)) {
      const reply = replies.find(r => r.id === parentId);
      if (reply) {
        return (
          reply.content?.slice(0, 20) + (reply.content && reply.content.length > 20 ? '...' : '') ||
          ''
        );
      }
    }

    return `#${parentId}`; // 如果找不到，还是显示ID
  };

  // 获取表单初始值
  const getFormInitialValues = useCallback(() => {
    if (isEdit && currentRecord) {
      return currentRecord;
    }
    if (replyParentComment) {
      return {
        blog_id: replyParentComment.blog_id,
        parent_id: replyParentComment.id,
        content: '',
      };
    }
    return {};
  }, [isEdit, currentRecord, replyParentComment]);

  // 当模态框打开时设置表单初始值
  useEffect(() => {
    if (modalVisible) {
      const initialValues = getFormInitialValues();
      crudForm.setFieldsValue(initialValues);
    }
  }, [modalVisible, isEdit, currentRecord, replyParentComment, crudForm, getFormInitialValues]);

  // 表格列定义
  const columns: TableColumn[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      render: (content: string, record: CommentData) => (
        <div>
          <div className={styles.commentContent}>
            {content.length > 100 ? `${content.substring(0, 100)}...` : content}
          </div>
          <div className={styles.commentMeta}>
            <Tag color='green' icon={<MessageOutlined />}>
              主评论
            </Tag>
            <span className={styles.commentTime}>
              {dayjs(record.created_at).format('YYYY-MM-DD HH:mm')}
            </span>
            <span className={styles.replyCount}>{record.reply_count || 0} 条回复</span>
          </div>
        </div>
      ),
    },
    {
      title: '用户信息',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 120,
      render: (userId: number) => (
        <div className={styles.userInfo}>
          <Avatar size='small' icon={<UserOutlined />} />
          <span className={styles.userName}>{getUserName(userId)}</span>
        </div>
      ),
    },
    {
      title: '所属博客',
      dataIndex: 'blog_id',
      key: 'blog_id',
      width: 200,
      render: (blogId: number) => (
        <div className={styles.blogInfo}>
          <FileTextOutlined className={styles.blogIcon} />
          <span className={styles.blogTitle}>{getBlogTitle(blogId)}</span>
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (_, record: CommentData) => (
        <Space size='small'>
          <Tooltip title='查看详情'>
            <Button
              type='text'
              size='small'
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title='回复'>
            <Button
              type='text'
              size='small'
              icon={<CommentOutlined />}
              onClick={() => handleReply(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          {hasPermission('update') && (
            <Tooltip title='编辑'>
              <Button
                type='text'
                size='small'
                icon={<EditOutlined />}
                onClick={() => {
                  // 清除回复状态
                  setReplyParentId(null);
                  setReplyParentComment(null);
                  showEditModal(record);
                }}
              />
            </Tooltip>
          )}
          {hasPermission('delete') && (
            <Tooltip title='删除'>
              <Button
                type='text'
                size='small'
                danger
                icon={<DeleteOutlined />}
                onClick={() => showDeleteModal(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 主评论数据（只包含主评论，用于表格显示）
  const mainCommentsData = data?.list || [];

  return (
    <div className={`${styles.root} ${pageStyles.pageContainer}`}>
      <div className={pageStyles.pageContent}>
        {/* 搜索区域 */}
        <SearchCard
          title='查询条件'
          form={searchForm}
          onFinish={onFinish}
          onReset={handleReset}
          loading={loading}
          collapsed={searchCollapsed}
          onToggleCollapse={() => setSearchCollapsed(!searchCollapsed)}
        >
          <Form.Item name='content' label='评论内容'>
            <Input allowClear placeholder='输入评论内容' style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name='user_id' label='用户'>
            <Select allowClear placeholder='选择用户' style={{ width: 160 }}>
              {users?.map(user => (
                <Select.Option key={user.id} value={user.id}>
                  {user.username}
                </Select.Option>
              ))}
            </Select>
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
          <Table
            columns={columns}
            dataSource={mainCommentsData}
            rowKey='id'
            pagination={{
              total: data?.total || 0,
              current: data?.currentPage || 1,
              pageSize: data?.pageSize || 10,
              onChange: handleTableChange,
            }}
            loading={loading}
            scroll={{ x: 800 }}
            expandable={{
              onExpand: (expanded, record) => {
                if (expanded && record.id) {
                  fetchRepliesForComment(record.id);
                }
              },
              expandedRowRender: (record: CommentData) => {
                const replies = getAllReplies(record.id);
                const isLoading = loadingReplies.has(record.id!);

                if (isLoading) {
                  return (
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                      <Spin size='small' /> 正在加载回复...
                    </div>
                  );
                }

                if (replies.length === 0) {
                  return (
                    <div style={{ padding: '16px', color: '#8c8c8c', fontStyle: 'italic' }}>
                      暂无回复
                    </div>
                  );
                }

                // 只显示直接回复（第一层）
                const directReplies = getDirectReplies(record.id!, replies);

                return (
                  <div className={styles.repliesContainer}>
                    {directReplies.map(reply => renderReply(reply, replies, 0))}
                  </div>
                );
              },
              rowExpandable: (record: CommentData) => {
                // 使用后端返回的reply_count字段判断是否有回复
                return (record.reply_count || 0) > 0;
              },
              expandRowByClick: false,
            }}
          />
        </TableContainer>

        {/* 评论详情抽屉 */}
        <Drawer
          title='评论详情'
          placement='right'
          width={600}
          open={detailDrawerVisible}
          onClose={() => setDetailDrawerVisible(false)}
        >
          {selectedComment && (
            <div>
              <Descriptions column={1} bordered>
                <Descriptions.Item label='评论ID'>{selectedComment.id}</Descriptions.Item>
                <Descriptions.Item label='评论内容'>
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {selectedComment.content}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label='用户'>
                  {getUserName(selectedComment.user_id)}
                </Descriptions.Item>
                <Descriptions.Item label='所属博客'>
                  {getBlogTitle(selectedComment.blog_id)}
                </Descriptions.Item>
                <Descriptions.Item label='回复关系'>
                  {selectedComment.parent_id ? (
                    <Tag color='blue'>回复: {getReplyTargetContent(selectedComment.parent_id)}</Tag>
                  ) : (
                    <Tag color='green'>原始评论</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='创建时间'>
                  {dayjs(selectedComment.created_at).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Space>
                  {hasPermission('update') && (
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={() => {
                        setDetailDrawerVisible(false);
                        // 清除回复状态
                        setReplyParentId(null);
                        setReplyParentComment(null);
                        showEditModal(selectedComment);
                      }}
                    >
                      编辑评论
                    </Button>
                  )}
                  {hasPermission('delete') && (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setDetailDrawerVisible(false);
                        showDeleteModal(selectedComment);
                      }}
                    >
                      删除评论
                    </Button>
                  )}
                </Space>
              </div>
            </div>
          )}
        </Drawer>
      </div>

      {/* 表单模态框 */}
      <FormModal
        title={
          isEdit
            ? '编辑评论'
            : replyParentComment
              ? `回复评论 (ID: ${replyParentComment.id})`
              : '新增评论'
        }
        visible={modalVisible}
        form={crudForm}
        onCancel={() => {
          hideModal();
          // 清除回复状态
          setReplyParentId(null);
          setReplyParentComment(null);
          // 延迟清空表单，确保模态框完全关闭后再清空
          setTimeout(() => {
            crudForm.resetFields();
          }, 100);
        }}
        onSubmit={handleSubmit}
        loading={crudLoading}
        initialValues={getFormInitialValues()}
      >
        {replyParentComment && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: '#f5f5f5',
              borderRadius: 6,
              borderLeft: '3px solid #1890ff',
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
              回复给用户 {replyParentComment.user_id}：
            </div>
            <div style={{ fontSize: 13, color: '#333' }}>
              {replyParentComment.content.length > 100
                ? `${replyParentComment.content.substring(0, 100)}...`
                : replyParentComment.content}
            </div>
          </div>
        )}
        <CommentForm
          blogs={blogs || []}
          comments={allComments?.list || []}
          isReply={!!replyParentComment}
          replyInfo={
            replyParentComment
              ? {
                  parentId: replyParentComment.id,
                  blogId: replyParentComment.blog_id,
                  blogTitle: getBlogTitle(replyParentComment.blog_id),
                }
              : undefined
          }
        />
      </FormModal>

      {/* 删除确认模态框 */}
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
