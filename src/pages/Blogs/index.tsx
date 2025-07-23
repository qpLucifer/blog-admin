import React, { useState } from 'react';
import { Card, Tag, Space, Image, Input, Form, Select, Button, Row, Col } from 'antd';
import styles from './index.module.css';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../api/blog';
import { BlogData, TagData, TableColumn, User } from '../../types';
import { useApi, useCrud, useInitialEffect, useMountEffect } from '../../hooks';
import { DeleteModal, ActionButtons, CommonTable, CommonTableButton } from '../../components';
import { useMenuPermission } from '../../hooks/useMenuPermission';
import { useNavigate } from 'react-router-dom';
import { tagColor } from '../../constants';
import { getUsersList } from '../../api/user';

const { Option } = Select;

const Blogs: React.FC = () => {
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    pageSize: 10,
    title: '',
    is_published: undefined,
    is_choice: undefined,
    author_id: '',
  });

  const {
    data,
    loading,
    error,
    execute: fetchBlogs,
  } = useApi<{ list: BlogData[]; total: number }>(() => getBlogs(queryParams), {
    showError: false,
  });

  const { data: users, execute: fetchUsers } = useApi<User[]>(() => getUsersList(), {
    showError: false,
  });

  useMountEffect(() => {
    fetchUsers();
  });

  useInitialEffect(() => {
    fetchBlogs();
  }, [queryParams]);

  const { hasPermission } = useMenuPermission();
  const navigate = useNavigate();

  const {
    deleteModalVisible,
    loading: crudLoading,
    currentRecord,
    showDeleteModal,
    hideDeleteModal,
    handleDelete: handleDeleteConfirm,
  } = useCrud<BlogData>({
    createApi: createBlog,
    updateApi: updateBlog,
    deleteApi: deleteBlog,
    createSuccessMessage: '博客创建成功',
    updateSuccessMessage: '博客更新成功',
    deleteSuccessMessage: '博客删除成功',
    onSuccess: fetchBlogs,
  });

  function handleEdit(record: BlogData) {
    navigate(`/blogsManage/blogs/edit/${record.id}`);
  }
  function handleDelete(record: BlogData) {
    showDeleteModal(record);
  }
  const handleAdd = () => {
    navigate('/blogsManage/blogs/new');
  };
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm();
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
    setQueryParams({
      currentPage: 1,
      pageSize: 10,
      title: '',
      is_published: undefined,
      is_choice: undefined,
      author_id: '',
    });
  };

  const columns: TableColumn[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', width: 100 },
    {
      title: '封面图片',
      dataIndex: 'cover_image',
      width: 100,
      render: (v: string) =>
        v && (
          <Image src={process.env.REACT_APP_IMAGE_BASE_URL + v} alt={v} style={{ width: '100%' }} />
        ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 180,
      render: (tags: TagData[]) => (
        <Space>
          {tags?.map((tag, index) => (
            <Tag key={tag.id} style={{ color: tagColor[index] }}>
              {tag.name}
            </Tag>
          )) || '-'}
        </Space>
      ),
    },
    { title: '作者', dataIndex: 'author_id', width: 100 },
    {
      title: '发布状态',
      dataIndex: 'is_published',
      width: 100,
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? '已发布' : '未发布'}</Tag>,
    },
    {
      title: '精选状态',
      dataIndex: 'is_choice',
      width: 100,
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? '已精选' : '未精选'}</Tag>,
    },
    { title: '阅读量', dataIndex: 'views', width: 100 },
    { title: '点赞数', dataIndex: 'likes', width: 100 },
    { title: '评论数', dataIndex: 'comments_count', width: 100 },
    {
      title: '需要时间',
      dataIndex: 'need_time',
      width: 100,
      render: (v: number) => (v ? `${v} 分钟` : ''),
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'operation',
      width: 150,
      fixed: 'right',
      render: (_: any, record: BlogData) => (
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
      {/* 顶部统计区块 */}
      <div className={styles.statsBar}>
        <Row style={{ width: '100%' }} align='middle' gutter={24}>
          <Col flex='180px'>
            <div className={styles.statCard}>
              <div className={styles.statNum}>{data?.total || 0}</div>
              <div className={styles.statLabel}>博客总数</div>
            </div>
          </Col>
          <Col flex='auto'>
            <Form
              form={form}
              layout='inline'
              onFinish={onFinish}
              initialValues={{
                title: '',
                is_published: undefined,
                is_choice: undefined,
                author_id: '',
              }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
            >
              <Form.Item name='title' label='标题'>
                <Input allowClear placeholder='输入标题' style={{ width: 140 }} />
              </Form.Item>
              <Form.Item name='is_published' label='发布状态'>
                <Select allowClear placeholder='全部' style={{ width: 110 }}>
                  <Option value={1}>已发布</Option>
                  <Option value={0}>未发布</Option>
                </Select>
              </Form.Item>
              <Form.Item name='is_choice' label='精选'>
                <Select allowClear placeholder='全部' style={{ width: 110 }}>
                  <Option value={1}>已精选</Option>
                  <Option value={0}>未精选</Option>
                </Select>
              </Form.Item>
              <Form.Item name='author_id' label='作者'>
                <Select allowClear placeholder='全部' style={{ width: 110 }}>
                  {users?.map(user => (
                    <Select.Option key={user.id} value={user.id}>
                      {user.username}
                    </Select.Option>
                  ))}
                </Select>
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
          </Col>
          <Col flex='220px' style={{ textAlign: 'right' }}>
            <CommonTableButton
              addButtonText='新增博客'
              onAdd={handleAdd}
              onReload={fetchBlogs}
              loading={loading}
              operations={{
                create: hasPermission('create'),
                update: hasPermission('update'),
                delete: hasPermission('delete'),
                read: hasPermission('read'),
              }}
            />
          </Col>
        </Row>
      </div>
      <Card style={{ borderRadius: 16, marginTop: 16 }}>
        <CommonTable
          columns={columns}
          dataSource={data?.list || []}
          rowKey='id'
          pagination={{
            current: queryParams.currentPage,
            pageSize: queryParams.pageSize,
            total: data?.total,
            onChange: handleTableChange,
          }}
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
