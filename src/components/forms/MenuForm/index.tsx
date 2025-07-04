import React from "react";
import { Form, Input, Select, Checkbox } from "antd";
import {
  NumberOutlined,
  CrownOutlined,
  LinkOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import * as AllIcons from "@ant-design/icons";
const { Option } = Select;

/**
 * 菜单表单组件
 * 用于新增和编辑菜单
 */
const MenuForm: React.FC = () => {
  return (
    <>
      <Form.Item
        name="name"
        label="菜单名"
        rules={[{ required: true, message: "请输入菜单名" }]}
      >
        <Input prefix={<MenuOutlined />} placeholder="请输入菜单名" />
      </Form.Item>

      <Form.Item
        name="path"
        label="路径"
        rules={[{ required: true, message: "请输入路径" }]}
      >
        <Input prefix={<LinkOutlined />} placeholder="请输入路径" />
      </Form.Item>

      <Form.Item
        name="order"
        label="排序"
        rules={[{ required: true, message: "请输入排序" }]}
      >
        <Input
          prefix={<NumberOutlined />}
          placeholder="请输入排序"
          type="number"
        />
      </Form.Item>

      {/* 选择icon组件 */}
      <Form.Item
        name="icon"
        label="图标"
        rules={[{ required: true, message: "请选择图标" }]}
      >
        <Input prefix={<CrownOutlined />} placeholder="请选择图标" />
      </Form.Item>
            {/* 增删改查权限多选框 */}
      <Form.Item
        name="permissions"
        label="权限"
        rules={[{ required: true, message: "请选择权限" }]}
      >
        <Checkbox.Group options={[
          { label: '新增', value: 'create' },
          { label: '删除', value: 'delete' },
          { label: '修改', value: 'update' },
          { label: '查询', value: 'read' },
        ]} />
      </Form.Item>
    </>
  );
};

export default MenuForm;
