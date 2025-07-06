import React from "react";
import { Form, Input, Select, Table, Checkbox } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu } from "../../../types";

const { Option } = Select;

interface UserFormProps {
  isEdit?: boolean;
  menus?: Menu[];
}

/**
 * 角色表单组件
 * 用于新增和编辑角色
 */
const RoleForm: React.FC<UserFormProps> = ({ isEdit = false, menus = [] }) => {
  // 自定义表单控件 - 菜单权限选择器
  const MenuPermissionSelector = ({ value = [], onChange }: any) => {
    // 处理菜单选择变化
    const handleMenuChange = (selectedMenuIds: number[]) => {
      // 创建新值结构：{ menuId, permissions: [] }
      const newValue = selectedMenuIds.map((menuId) => {
        const existing = value.find((item: any) => item.menuId === menuId);
        return existing || { menuId, name:menus.find((item:any)=>item.id===menuId)?.name, roleMenu: {} };
      });
      onChange(newValue);
    };

    // 处理权限变化
    const handlePermissionChange = (
      menuId: number,
      checkedPermissions: {
        can_create: boolean;
        can_read: boolean;
        can_update: boolean;
        can_delete: boolean;
      }
    ) => {
      const newValue = value.map((item: any) =>
        item.menuId === menuId
          ? { ...item, roleMenu: checkedPermissions }
          : item
      );
      onChange(newValue);
    };

    // 表格列定义
    const columns = [
      {
        title: "菜单名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "新增",
        key: "create",
        render: (_: any, record: any) => (
          <Checkbox
            checked={record.roleMenu.can_create}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? { ...record.roleMenu, can_create: true }
                : { ...record.roleMenu, can_create: false };
              handlePermissionChange(record.menuId, newPermissions);
            }}
          />
        ),
      },
      {
        title: "删除",
        key: "delete",
        render: (_: any, record: any) => (
          <Checkbox
            checked={record.roleMenu.can_delete}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? { ...record.roleMenu, can_delete: true }
                : { ...record.roleMenu, can_delete: false };
              handlePermissionChange(record.menuId, newPermissions);
            }}
          />
        ),
      },
      {
        title: "修改",
        key: "update",
        render: (_: any, record: any) => (
          <Checkbox
            checked={record.roleMenu.can_update}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? { ...record.roleMenu, can_update: true }
                : { ...record.roleMenu, can_update: false };
              handlePermissionChange(record.menuId, newPermissions);
            }}
          />
        ),
      },
      {
        title: "查询",
        key: "read",
        render: (_: any, record: any) => (
          <Checkbox
            checked={record.roleMenu.can_read}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? { ...record.roleMenu, can_read: true }
                : { ...record.roleMenu, can_read: false };
              handlePermissionChange(record.menuId, newPermissions);
            }}
          />
        ),
      },
    ];

    // 获取已选中的菜单ID
    const selectedMenuIds = value.map((item: any) => item.menuId);

    return (
      <div>
        <Select
          mode="multiple"
          placeholder="请选择菜单"
          value={selectedMenuIds}
          onChange={handleMenuChange}
          prefix={<LockOutlined />}
          showSearch
          optionFilterProp="children"
          style={{ width: "100%", marginBottom: 16 }}
        >
          {menus.map((menu) => (
            <Option key={menu.id} value={menu.id}>
              {menu.name}
            </Option>
          ))}
        </Select>

        <Table
          columns={columns}
          dataSource={value
            .filter((menu:any) => selectedMenuIds.includes(menu.menuId))}
          rowKey="menuId"
          pagination={false}
          bordered
          size="small"
        />
      </div>
    );
  };

  return (
    <>
      <Form.Item
        name="name"
        label="角色名"
        rules={[
          { required: true, message: "请输入角色名" },
          { min: 3, max: 20, message: "角色名长度必须在3-20个字符之间" },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "角色名只能包含字母、数字和下划线",
          },
        ]}
      >
        <Input
          prefix={<TeamOutlined />}
          placeholder="请输入角色名"
          disabled={isEdit}
        />
      </Form.Item>

      {/* 修改后的菜单权限选择器 */}
      <Form.Item
        name="menus" // 修改字段名为 menuPermissions
        label="菜单权限"
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (!value || value.length === 0) {
                return Promise.reject(new Error("请至少选择一个菜单"));
              }
              // 检查是否所有选中的菜单都至少有一个权限
              // const hasEmptyPermissions = value.some(
              //   (item: any) =>
              //     !item.roleMenu ||
              //     (item.roleMenu.can_create ||
              //     item.roleMenu.can_read ||
              //     item.roleMenu.can_update ||
              //     item.roleMenu.can_delete)
              // );
              // if (hasEmptyPermissions) {
              //   return Promise.reject(
              //     new Error("请为每个选择的菜单分配至少一个权限")
              //   );
              // }
              return Promise.resolve();
            },
          },
        ]}
      >
        <MenuPermissionSelector />
      </Form.Item>

      <Form.Item
        name="description"
        label="描述"
        rules={[{ required: true, message: "请输入描述" }]}
      >
        <Input.TextArea placeholder="请输入描述" maxLength={200} showCount />
      </Form.Item>
    </>
  );
};

export default RoleForm;
