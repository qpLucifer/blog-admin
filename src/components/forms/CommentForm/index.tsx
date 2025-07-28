import React, { useMemo } from 'react';
import { Form, Input, Select } from 'antd';
import { CommentFormProps } from '../../../types';

const { Option } = Select;

const CommentForm: React.FC<CommentFormProps> = ({
  blogs = [],
  comments = [],
  isReply = false,
  replyInfo,
}) => {
  // 获取表单实例
  const form = Form.useFormInstance();

  // 使用Form.useWatch来监听博客ID的变化
  const watchedBlogId = Form.useWatch('blog_id');

  // 确定当前的博客ID
  const currentBlogId = isReply && replyInfo ? replyInfo.blogId : watchedBlogId;

  // 当表单字段值变化时更新状态
  const handleBlogChange = () => {
    // 当博客变化时，清空父评论选择
    if (!isReply && form) {
      form.setFieldValue('parent_id', undefined);
    }
  };

  const filteredComments = useMemo(() => {
    // 如果没有选择博客，返回空数组
    if (!currentBlogId) {
      return [];
    }
    // 根据博客ID过滤评论
    const filtered = (comments || []).filter(c => c.blog_id === currentBlogId);
    return filtered;
  }, [comments, currentBlogId]);

  return (
    <>
      {/* 回复模式下显示提示信息 */}
      {isReply && replyInfo && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: 6,
            borderLeft: '4px solid #0ea5e9',
          }}
        >
          <div style={{ fontSize: 12, color: '#0369a1', marginBottom: 4 }}>📝 回复模式</div>
          <div style={{ fontSize: 13, color: '#0c4a6e' }}>
            <strong>博客：</strong>
            {replyInfo.blogTitle}
          </div>
          <div style={{ fontSize: 13, color: '#0c4a6e' }}>
            <strong>回复评论：</strong>#{replyInfo.parentId}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            💡 博客和父评论已自动设置且不可修改
          </div>
        </div>
      )}

      <Form.Item
        name='blog_id'
        label='所属博客'
        rules={[{ required: true, message: '请选择所属博客' }]}
      >
        <Select
          showSearch
          disabled={isReply} // 回复时禁用博客选择
          filterOption={(input, option) => {
            const label = typeof option?.children === 'string' ? option.children : '';
            return label.toLowerCase().includes(input.toLowerCase());
          }}
          placeholder={isReply ? replyInfo?.blogTitle : '请选择所属博客'}
          onChange={handleBlogChange}
        >
          {blogs.map(blog => (
            <Option key={blog.id} value={blog.id}>
              {blog.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='parent_id' label='父评论'>
        <Select
          placeholder={
            isReply
              ? `回复评论 #${replyInfo?.parentId}`
              : !currentBlogId
                ? '请先选择所属博客'
                : filteredComments.length === 0
                  ? '该博客下暂无评论'
                  : '不选择则为一级评论'
          }
          allowClear={!isReply} // 回复时不允许清空
          disabled={isReply || !currentBlogId} // 回复时或未选择博客时禁用
          notFoundContent={!currentBlogId ? '请先选择所属博客' : '该博客下暂无评论'}
        >
          {filteredComments.map(comment => {
            return (
              <Option key={comment.id} value={comment.id}>
                {`[${comment.id}] ${comment.content?.slice(0, 30)}${comment.content && comment.content.length > 30 ? '...' : ''}`}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name='content'
        label='评论内容'
        rules={[{ required: true, message: '请输入评论内容' }]}
      >
        <Input.TextArea rows={3} placeholder='请输入评论内容' />
      </Form.Item>
    </>
  );
};

export default CommentForm;
