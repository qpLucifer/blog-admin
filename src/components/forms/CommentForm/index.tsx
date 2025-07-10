import React from 'react';
import { Form, Input, Select } from 'antd';
import { CommentData, BlogData } from '../../../types';

const { Option } = Select;

interface CommentFormProps {
  blogs?: BlogData[];
}

const CommentForm: React.FC<CommentFormProps> = ({ blogs = [] }) => {
  return (
    <>
      <Form.Item
        name="blog_id"
        label="所属博客"
        rules={[{ required: true, message: '请选择所属博客' }]}
      >
        <Select placeholder="请选择所属博客">
          {blogs.map(blog => (
            <Option key={blog.id} value={blog.id}>{blog.title}</Option>
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