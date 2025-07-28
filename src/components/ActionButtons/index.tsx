import React from 'react';
import { Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionButtonsProps } from '../../types';

/**
 * 通用操作按钮组件
 * 包含编辑和删除按钮
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
  record,
  onEdit,
  onDelete,
  editText = '编辑',
  deleteText = '删除',
  deleteConfirmText = '确定要删除这条记录吗？',
  showEdit = true,
  showDelete = true,
  editDisabled = false,
  deleteDisabled = false,
  size = 'small',
}) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(record);
    }
  };

  return (
    <Space>
      {showEdit && (
        <Button
          type='link'
          icon={<EditOutlined />}
          size={size}
          onClick={handleEdit}
          disabled={editDisabled}
        >
          {editText}
        </Button>
      )}
      {showDelete && (
        <Popconfirm
          title={deleteConfirmText}
          onConfirm={handleDelete}
          okText='确定'
          cancelText='取消'
          placement='topRight'
        >
          <Button
            type='link'
            icon={<DeleteOutlined />}
            size={size}
            danger
            disabled={deleteDisabled}
          >
            {deleteText}
          </Button>
        </Popconfirm>
      )}
    </Space>
  );
};

export default ActionButtons;
