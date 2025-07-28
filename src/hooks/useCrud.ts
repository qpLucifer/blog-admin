import { useState, useCallback } from 'react';
import { message } from 'antd';
import { UseCrudOptions, UseCrudReturn } from '../types';

/**
 * 通用CRUD管理Hook
 * 用于管理新增、编辑、删除操作的状态和逻辑
 */
export function useCrud<T = any>(options: UseCrudOptions<T> = {}): UseCrudReturn<T> {
  const {
    createApi,
    updateApi,
    deleteApi,
    createSuccessMessage = '创建成功',
    updateSuccessMessage = '更新成功',
    deleteSuccessMessage = '删除成功',
    onSuccess,
    onError,
  } = options;

  // 状态管理
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<T | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  // 显示新增弹窗
  const showCreateModal = useCallback(() => {
    setCurrentRecord(null);
    setIsEdit(false);
    setModalVisible(true);
  }, []);

  // 显示编辑弹窗
  const showEditModal = useCallback((record: T) => {
    setCurrentRecord(record);
    setIsEdit(true);
    setModalVisible(true);
  }, []);

  // 显示删除弹窗
  const showDeleteModal = useCallback((record: T) => {
    setCurrentRecord(record);
    setDeleteModalVisible(true);
  }, []);

  // 隐藏弹窗
  const hideModal = useCallback(() => {
    setModalVisible(false);
    setCurrentRecord(null);
    setIsEdit(false);
  }, []);

  // 隐藏删除弹窗
  const hideDeleteModal = useCallback(() => {
    setDeleteModalVisible(false);
    setCurrentRecord(null);
  }, []);

  // 处理创建
  const handleCreate = useCallback(
    async (values: any) => {
      if (!createApi) {
        console.warn('createApi 未提供');
        return;
      }

      try {
        setLoading(true);
        const result = await createApi(values);
        message.success(createSuccessMessage);
        hideModal();
        onSuccess?.('create', result);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || '创建失败';
        if (!error.handled) {
          message.error(errorMessage);
        }
        onError?.('create', error);
      } finally {
        setLoading(false);
      }
    },
    [createApi, createSuccessMessage, hideModal, onSuccess, onError]
  );

  // 处理更新
  const handleUpdate = useCallback(
    async (values: any) => {
      if (!updateApi || !currentRecord) {
        console.warn('updateApi 未提供或 currentRecord 为空');
        return;
      }

      try {
        setLoading(true);
        const id = (currentRecord as any).id;
        const result = await updateApi(id, values);
        message.success(updateSuccessMessage);
        hideModal();
        onSuccess?.('update', result);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || '更新失败';
        if (!error.handled) {
          message.error(errorMessage);
        }
        onError?.('update', error);
      } finally {
        setLoading(false);
      }
    },
    [updateApi, currentRecord, updateSuccessMessage, hideModal, onSuccess, onError]
  );

  // 处理删除
  const handleDelete = useCallback(async () => {
    if (!deleteApi || !currentRecord) {
      console.warn('deleteApi 未提供或 currentRecord 为空');
      return;
    }

    try {
      setLoading(true);
      const id = (currentRecord as any).id;
      await deleteApi(id);
      message.success(deleteSuccessMessage);
      hideDeleteModal();
      onSuccess?.('delete');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '删除失败';
      if (!error.handled) {
        message.error(errorMessage);
      }
      onError?.('delete', error);
    } finally {
      setLoading(false);
    }
  }, [deleteApi, currentRecord, deleteSuccessMessage, hideDeleteModal, onSuccess, onError]);

  return {
    modalVisible,
    deleteModalVisible,
    loading,
    currentRecord,
    isEdit,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    hideModal,
    hideDeleteModal,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
