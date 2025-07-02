import React from 'react';
import { Form, Input} from 'antd';
import {  TeamOutlined } from '@ant-design/icons';

interface PermissionFormProps {
  isEdit?: boolean;
}

/**
 * 权限表单组件
 * 用于新增和编辑权限
 */
const PermissionForm: React.FC<PermissionFormProps> = ({ isEdit = false }) => {
  return (
    <>
      <Form.Item
        name="name"
        label="权限名"
        rules={[
          { required: true, message: '请输入权限名' },
          // { min: 3, max: 20, message: '权限名长度必须在3-20个字符之间' },
          // { pattern: /^[a-zA-Z0-9_]+$/, message: '权限名只能包含字母、数字和下划线' }
        ]}
      >
        <Input 
          prefix={<TeamOutlined />} 
          placeholder="请输入权限名"
          disabled={isEdit} // 编辑时不允许修改角色名
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="描述"
        rules={[
          { required: true, message: '请输入描述' },
        ]}
      >
        <Input.TextArea
          placeholder="请输入描述"
          maxLength={200}
          showCount
        />
      </Form.Item>
   
    </>
  );
};

export default PermissionForm; 
