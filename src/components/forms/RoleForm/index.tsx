import React from 'react';
import { Form, Input, Select, } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Permission } from '../../../types';

const { Option } = Select;

interface UserFormProps {
  isEdit?: boolean;
  permission_ids?: Permission[];
}

/**
 * 角色表单组件
 * 用于新增和编辑角色
 */
const RoleForm: React.FC<UserFormProps> = ({ isEdit = false, permission_ids = [] }) => {
  return (
    <>
      <Form.Item
        name="name"
        label="角色名"
        rules={[
          { required: true, message: '请输入角色名' },
          { min: 3, max: 20, message: '角色名长度必须在3-20个字符之间' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '角色名只能包含字母、数字和下划线' }
        ]}
      >
        <Input 
          prefix={<TeamOutlined />} 
          placeholder="请输入角色名"
          disabled={isEdit} // 编辑时不允许修改角色名
        />
      </Form.Item>

      <Form.Item
        name="permissions"
        label="权限"
        rules={[
          { required: true, message: '请选择权限' }
        ]}
      >
        <Select
          mode="multiple"
          placeholder="请选择权限"
          prefix={<LockOutlined />}
          showSearch
          optionFilterProp="children"
        >
          {permission_ids.map(permission => (
            <Option key={permission.id} value={permission.id}>
              {permission.description}
            </Option>
          ))}
        </Select>
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

export default RoleForm; 
