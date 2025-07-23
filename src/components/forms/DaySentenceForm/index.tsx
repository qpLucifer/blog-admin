import React from 'react';
import { Form, Input } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

/**
 * 每日一句表单组件
 * 用于新增和编辑每日一句
 */
const DaySentenceForm: React.FC = () => {
  return (
    <>
      <Form.Item name='auth' label='作者' rules={[{ required: true, message: '请输入作者' }]}>
        <Input prefix={<TeamOutlined />} placeholder='请输入作者' maxLength={200} showCount />
      </Form.Item>

      <Form.Item
        name='day_sentence'
        label='每日一句'
        rules={[{ required: true, message: '请输入每日一句' }]}
      >
        <Input.TextArea placeholder='请输入每日一句' />
      </Form.Item>
    </>
  );
};

export default DaySentenceForm;
