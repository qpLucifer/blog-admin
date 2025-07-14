import React, { useEffect, useState } from 'react';
import { Card, message, Spin, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import BlogForm from '../../components/forms/BlogForm';
import { getBlog, createBlog, updateBlog } from '../../api/blog';
import { getTags } from '../../api/tag';
import { BlogData, TagData, authReducer } from '../../types';
import styles from './index.module.css';
import { useApi, useInitialAsyncEffect } from '../../hooks';
import { useSelector } from 'react-redux';

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useSelector((state: authReducer) => state.auth);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>({});
  const { data: tags, loading: tagsLoading, error: tagsError, execute: fetchTags } = useApi<TagData[]>(getTags, { showError: false });
  const { data: blog, loading: blogLoading, error: blogError, execute: fetchBlog } = useApi<BlogData>(getBlog, { showError: false });

  useInitialAsyncEffect(fetchTags);

  // 拉取博客详情
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchBlog(Number(id));
    }
  }, [id, isEdit, fetchBlog]);

  // blog 数据变化时设置初始值
  useEffect(() => {
    if (isEdit && blog) {
      setInitialValues({ ...blog, tags: blog.tags?.map((t: any) => t.id) || [] });
      setLoading(false);
    } else if (!isEdit) {
      setInitialValues({});
      setLoading(false);
    }
  }, [blog, isEdit]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      values.author_id = user?.id;
      if (isEdit && id) {
        await updateBlog(Number(id), { ...values });
        message.success('博客更新成功');
      } else {
        await createBlog(values);
        message.success('博客创建成功');
      }
      navigate('/blogs');
    } catch (e) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div style={{ maxWidth: 1200, margin: '32px auto 0', position: 'relative' }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontSize: 20,
            color: '#6a4bc6',
            zIndex: 10,
          }}
          onClick={() => navigate('/blogs')}
        >
          返回
        </Button>
        <Spin spinning={loading || tagsLoading || blogLoading} tip="加载中...">
          <Card
            style={{
              width: '100%',
              minHeight: '70vh',
              borderRadius: 32,
              boxShadow: '0 8px 32px rgba(160,140,209,0.18)',
              padding: '48px 48px 32px 48px',
              background: 'rgba(255,255,255,0.98)',
            }}
            bodyStyle={{ padding: 0 }}
          >
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                marginBottom: 32,
                background: 'linear-gradient(90deg,#a18cd1,#fbc2eb)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
                letterSpacing: 2,
              }}
            >
              {isEdit ? '编辑博客' : '新增博客'}
            </h2>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <BlogForm isEdit={isEdit} tags={tags || []} initialValues={initialValues} onSubmit={handleSubmit} />
            </div>
          </Card>
        </Spin>
      </div>
    </div>
  );
};

export default EditBlog; 