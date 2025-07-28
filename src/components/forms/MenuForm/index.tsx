import React from 'react';
import { Form, Input, TreeSelect } from 'antd';
import { NumberOutlined, LinkOutlined, MenuOutlined } from '@ant-design/icons';
import { IconSelector } from '../../index';
import { MenuFormProps } from '../../../types';

/**
 * 菜单表单组件
 * 用于新增和编辑菜单
 */

const MenuForm: React.FC<MenuFormProps> = ({ menus = [], currentId }) => {
  // 递归生成树形选项
  const renderTreeNodes = (data: any[]) =>
    data.map(item => {
      if (item.id === currentId) return null; // 禁止自己作为自己的父级
      if (item.children && item.children.length > 0) {
        return (
          <TreeSelect.TreeNode value={item.id} title={item.name} key={item.id}>
            {renderTreeNodes(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode value={item.id} title={item.name} key={item.id} />;
    });

  return (
    <>
      <Form.Item name='name' label='菜单名' rules={[{ required: true, message: '请输入菜单名' }]}>
        <Input prefix={<MenuOutlined />} placeholder='请输入菜单名' />
      </Form.Item>

      <Form.Item name='path' label='路径' rules={[{ required: true, message: '请输入路径' }]}>
        <Input prefix={<LinkOutlined />} placeholder='请输入路径' />
      </Form.Item>

      <Form.Item name='order' label='排序' rules={[{ required: true, message: '请输入排序' }]}>
        <Input prefix={<NumberOutlined />} placeholder='请输入排序' type='number' />
      </Form.Item>

      <Form.Item name='parent_id' label='父级菜单'>
        <TreeSelect
          allowClear
          placeholder='请选择父级菜单（不选为顶级菜单）'
          treeDefaultExpandAll
          treeLine
        >
          {renderTreeNodes(menus)}
        </TreeSelect>
      </Form.Item>

      {/* 选择icon组件 */}
      <Form.Item name='icon' label='图标' rules={[{ required: true, message: '请选择图标' }]}>
        <IconSelector placeholder='请选择图标' />
      </Form.Item>
    </>
  );
};

export default MenuForm;
