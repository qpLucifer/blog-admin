import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface DeleteModalProps {
  visible: boolean;
  loading?: boolean;
  title?: string;
  content?: string;
  recordName?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  okText?: string;
  cancelText?: string;
}

/**
 * 通用删除确认弹窗组件
 */
const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  loading = false,
  title = '确认删除',
  content = '确定要删除这条记录吗？',
  recordName,
  onCancel,
  onConfirm,
  okText = '删除',
  cancelText = '取消'
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const getContent = () => {
    if (recordName) {
      return `确定要删除 "${recordName}" 吗？此操作不可恢复。`;
    }
    return content;
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ExclamationCircleOutlined 
            style={{ color: '#faad14', fontSize: '16px', marginRight: '8px' }} 
          />
          {title}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button 
          key="confirm" 
          type="primary" 
          danger
          loading={loading}
          onClick={handleConfirm}
        >
          {okText}
        </Button>
      ]}
      destroyOnHidden
      maskClosable={false}
    >
      <p>{getContent()}</p>
    </Modal>
  );
};

export default DeleteModal; 