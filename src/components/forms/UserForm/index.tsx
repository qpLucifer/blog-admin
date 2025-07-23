import React from 'react';
import { Form, Input, Select, Switch } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Role } from '../../../types';
const { Option } = Select;

interface UserFormProps {
  isEdit?: boolean;
  roles?: Role[];
}

/**
 * 用户表单组件
 * 用于新增和编辑用户
 */
const UserForm: React.FC<UserFormProps> = ({ isEdit = false, roles = [] }) => {
  return (
    <>
      <Form.Item
        name='username'
        label='用户名'
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, max: 20, message: '用户名长度必须在3-20个字符之间' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder='请输入用户名'
          disabled={isEdit} // 编辑时不允许修改用户名
        />
      </Form.Item>

      {!isEdit && (
        <Form.Item
          name='password'
          label='密码'
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度不能少于6个字符' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='请输入密码' />
        </Form.Item>
      )}

      <Form.Item
        name='email'
        label='邮箱'
        rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
      >
        <Input prefix={<MailOutlined />} placeholder='请输入邮箱' />
      </Form.Item>

      <Form.Item name='roles' label='角色' rules={[{ required: true, message: '请选择角色' }]}>
        <Select
          mode='multiple'
          placeholder='请选择角色'
          prefix={<TeamOutlined />}
          showSearch
          optionFilterProp='children'
        >
          {roles.map(role => (
            <Option key={role.id} value={role.id}>
              {role.description}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name='is_active' label='状态' valuePropName='checked' initialValue={true}>
        <Switch checkedChildren='启用' unCheckedChildren='禁用' />
      </Form.Item>
    </>
  );
};

export default UserForm;
