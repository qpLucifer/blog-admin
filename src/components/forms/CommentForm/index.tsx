import React, { useMemo } from 'react';
import { Form, Input, Select } from 'antd';
import { CommentData, BlogData } from '../../../types';

const { Option } = Select;

interface CommentFormProps {
  blogs?: BlogData[];
  comments?: CommentData[];
  form?: any;
}

const CommentForm: React.FC<CommentFormProps> = ({ blogs = [], comments = [], form }) => {
  const blogId = Form.useWatch('blog_id', form);
  const filteredComments = useMemo(
    () => (comments || []).filter(c => c.blog_id === blogId),
    [comments, blogId]
  );
  return (
    <>
      <Form.Item
        name="blog_id"
        label="所属博客"
        rules={[{ required: true, message: '请选择所属博客' }]}
      >
        <Select
          showSearch
          filterOption={(input, option) => {
            const label = typeof option?.children === 'string' ? option.children : '';
            return label.toLowerCase().includes(input.toLowerCase());
          }}
          placeholder="请选择所属博客"
        >
          {blogs.map(blog => (
            <Option key={blog.id} value={blog.id}>{blog.title}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="parent_id"
        label="父评论"
      >
        <Select placeholder="不选择则为一级评论" allowClear>
          {filteredComments.map(comment => (
            <Option key={comment.id} value={comment.id}>
              {`[${comment.id}] ${comment.content?.slice(0, 20)}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="content"
        label="评论内容"
        rules={[{ required: true, message: '请输入评论内容' }]}
      >
        <Input.TextArea rows={3} placeholder="请输入评论内容" />
      </Form.Item>
    </>
  );
};

export default CommentForm; 