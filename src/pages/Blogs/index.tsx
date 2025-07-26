import React, { useState } from 'react';
import { Tag, Space, Image, Input, Form, Select } from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import { getBlogsPage, createBlog, updateBlog, deleteBlog, exportBlogs } from '../../api/blog';
import { getUsersAll } from '../../api/user';
import { BlogData, TagData, User, TableColumn } from '../../types';
import { useApi, useCrud, useInitialEffect, useMountEffect } from '../../hooks';
import {
  DeleteModal,
  ActionButtons,
  CommonTable,
  SearchCard,
  TableToolbar,
  TableContainer,
} from '../../components';
import { useMenuPermission } from '../../hooks/useMenuPermission';
import { createExportHandler } from '../../utils/exportUtils';
import { useNavigate } from 'react-router-dom';
import { tagColor } from '../../constants';

const { Option } = Select;

const Blogs: React.FC = () => {
  const [form] = Form.useForm();
  const [searchCollapsed, setSearchCollapsed] = useState(false);
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
  } = useApi<{ list: BlogData[]; total: number }>(() => getBlogsPage(queryParams), {
    showError: false,
  });

  const { data: users, execute: fetchUsers } = useApi<User[]>(() => getUsersAll(), {
    showError: false,
  });

  useMountEffect(() => {
    fetchUsers();
  });

  useInitialEffect(() => {
    fetchBlogs();
  }, [
    queryParams.currentPage,
    queryParams.pageSize,
    queryParams.title,
    queryParams.is_published,
    queryParams.is_choice,
    queryParams.author_id,
  ]);

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

  // 创建导出处理函数
  const handleExport = createExportHandler({
    api: exportBlogs as (params: any) => Promise<any>,
    filename: '博客列表',
    params: {
      title: queryParams.title || undefined,
      is_published: queryParams.is_published,
      is_choice: queryParams.is_choice,
      author_id: queryParams.author_id || undefined,
    },
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
        </SearchCard>

        {/* 操作栏 */}
        <TableToolbar
          title={`博客管理 (共 ${data?.total || 0} 篇)`}
          showAdd={hasPermission('create')}
          addButtonText='新增博客'
          onAdd={handleAdd}
          onReload={fetchBlogs}
          loading={loading}
          selectedRowKeys={[]}
          onExport={hasPermission('read') ? handleExport : undefined}
          operations={{
            create: hasPermission('create'),
            export: hasPermission('read'),
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
              current: queryParams.currentPage || 1,
              pageSize: queryParams.pageSize || 10,
              onChange: handleTableChange,
            }}
            loading={loading}
            error={error}
            scroll={{ x: 1000 }}
          />
        </TableContainer>

        {/* 删除确认弹窗 */}
        <DeleteModal
          visible={deleteModalVisible}
          loading={crudLoading}
          recordName={currentRecord?.title}
          onCancel={hideDeleteModal}
          onConfirm={handleDeleteConfirmAction}
        />
      </div>
    </div>
  );
};

export default Blogs;
