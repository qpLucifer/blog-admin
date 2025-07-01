import React, { useEffect } from 'react';
import { Modal, Form, Button, Spin } from 'antd';
import { FormInstance } from 'antd/lib/form';

interface FormModalProps {
  title: string;
  visible: boolean;
  loading?: boolean;
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: any) => void | Promise<void>;
  children: React.ReactNode;
  width?: number;
  okText?: string;
  cancelText?: string;
  form?: FormInstance;
}

/**
 * 通用表单弹窗组件
 * 支持新增和编辑功能
 */
const FormModal: React.FC<FormModalProps> = ({
  title,
  visible,
  loading = false,
  initialValues,
  onCancel,
  onSubmit,
  children,
  width = 600,
  okText = '确定',
  cancelText = '取消',
  form: externalForm
}) => {
  const [form] = Form.useForm();
  const currentForm = externalForm || form;

  // 当弹窗打开时，设置初始值
  useEffect(() => {
    if (visible && initialValues) {
      currentForm.setFieldsValue(initialValues);
    } else if (visible) {
      currentForm.resetFields();
    }
  }, [visible, initialValues, currentForm]);

  const handleSubmit = async () => {
    try {
      const values = await currentForm.validateFields();
      await onSubmit(values);
      // 成功后重置表单
      currentForm.resetFields();
    } catch (error) {
      // 表单验证失败，不需要处理
      console.log('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    currentForm.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      width={width}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {cancelText}
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          {okText}
        </Button>
      ]}
      destroyOnHidden
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <Form
          form={currentForm}
          layout="vertical"
          preserve={true}
        >
          {children}
        </Form>
      </Spin>
    </Modal>
  );
};

export default FormModal; 