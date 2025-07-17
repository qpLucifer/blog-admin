import React from 'react';
import { Form, Input } from 'antd';

const TagForm: React.FC = () => {
  return (
    <>
      <Form.Item
        name="name"
        label="标签名"
        rules={[{ required: true, message: '请输入标签名' }]}
      >
        <Input placeholder="请输入标签名" />
      </Form.Item>
    </>
  );
};

export default TagForm; 