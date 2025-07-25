import React, { useState } from 'react';
import { Form, Input } from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import { TableColumn, DaySentence } from '../../types';
import { useApi, useCrud, useInitialEffect } from '../../hooks';
import { useMenuPermission } from '../../hooks/useMenuPermission';

import {
  getDaySentenceList,
  addDaySentence,
  updateDaySentence,
  deleteDaySentence,
} from '../../api/daySentence';
import {
  CommonTable,
  FormModal,
  DeleteModal,
  DaySentenceForm,
  ActionButtons,
  SearchCard,
  TableToolbar,
  TableContainer,
} from '../../components';

const DaySentences: React.FC = () => {
  const [form] = Form.useForm();
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    pageSize: 10,
    auth: '',
    day_sentence: '',
  });

  const {
    data,
    loading: daySentencesLoading,
    error: daySentencesError,
    execute: fetchDaySentences,
  } = useApi<{ list: DaySentence[]; total: number; pageSize: number; currentPage: number }>(
    () => getDaySentenceList(queryParams),
    { showError: false }
  );

  const { hasPermission } = useMenuPermission();

  // 当查询参数变化时重新获取数据
  useInitialEffect(() => {
    fetchDaySentences();
  }, [queryParams]);

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '作者', dataIndex: 'auth' },
    { title: '每日一句', dataIndex: 'day_sentence' },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: DaySentence) => (
        <ActionButtons
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editDisabled={!hasPermission('update')}
          deleteDisabled={!hasPermission('delete')}
        />
      ),
    },
  ];

  // CRUD 管理
  const {
    modalVisible,
    deleteModalVisible,
    loading: crudLoading,
    currentRecord,
    isEdit,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    hideModal,
    hideDeleteModal,
    handleCreate,
    handleUpdate,
    handleDelete: handleDeleteConfirm,
  } = useCrud<DaySentence>({
    createApi: addDaySentence,
    updateApi: updateDaySentence,
    deleteApi: deleteDaySentence,
    createSuccessMessage: '每日一句创建成功',
    updateSuccessMessage: '每日一句更新成功',
    deleteSuccessMessage: '每日一句删除成功',
    onSuccess: () => {
      // 操作成功后刷新列表
      fetchDaySentences();
    },
  });

  // 处理编辑
  function handleEdit(record: DaySentence) {
    showEditModal(record);
  }

  // 处理删除
  function handleDelete(record: DaySentence) {
    showDeleteModal(record);
  }

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    if (isEdit) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  };

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    setQueryParams(prev => ({
      ...prev,
      currentPage: page,
      pageSize: pageSize,
    }));
  };

  // 处理搜索
  const onFinish = (values: any) => {
    setQueryParams(prev => ({
      ...prev,
      ...values,
      currentPage: 1,
    }));
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setQueryParams({
      currentPage: 1,
      pageSize: 10,
      auth: '',
      day_sentence: '',
    });
  };

  // 处理删除确认
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm();
  };

  // 获取表单初始值
  const getInitialValues = () => {
    if (!currentRecord) return {};

    return {
      auth: currentRecord.auth,
      day_sentence: currentRecord.day_sentence,
    };
  };

  return (
    <div className={`${styles.root} ${pageStyles.pageContainer}`}>
      <div className={pageStyles.pageContent}>
        {/* 搜索区域 */}
        <SearchCard
          title='查询条件'
          form={form}
          onFinish={onFinish}
          onReset={handleReset}
          loading={daySentencesLoading}
          collapsed={searchCollapsed}
          onToggleCollapse={() => setSearchCollapsed(!searchCollapsed)}
        >
          <Form.Item name='auth' label='作者'>
            <Input allowClear placeholder='输入作者' style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name='day_sentence' label='内容'>
            <Input allowClear placeholder='输入内容' style={{ width: 200 }} />
          </Form.Item>
        </SearchCard>

        {/* 操作栏 */}
        <TableToolbar
          title='每日一句管理'
          showAdd={hasPermission('create')}
          addButtonText='新增每日一句'
          onAdd={showCreateModal}
          onReload={fetchDaySentences}
          loading={daySentencesLoading}
          selectedRowKeys={[]}
          operations={{
            create: hasPermission('create'),
            export: hasPermission('read'),
          }}
        />

        {/* 表格区域 */}
        <TableContainer loading={daySentencesLoading}>
          <CommonTable
            onReload={fetchDaySentences}
            columns={columns as TableColumn[]}
            dataSource={data?.list || []}
            error={daySentencesError}
            loading={daySentencesLoading}
            pagination={{
              total: data?.total || 0,
              current: data?.currentPage || 1,
              pageSize: data?.pageSize || 10,
              onChange: handleTableChange,
            }}
          />
        </TableContainer>

        {/* 新增/编辑弹窗 */}
        <FormModal
          title={isEdit ? '编辑每日一句' : '新增每日一句'}
          visible={modalVisible}
          loading={crudLoading}
          initialValues={getInitialValues()}
          onCancel={hideModal}
          onSubmit={handleSubmit}
          width={600}
        >
          <DaySentenceForm />
        </FormModal>

        {/* 删除确认弹窗 */}
        <DeleteModal
          visible={deleteModalVisible}
          loading={crudLoading}
          recordName={currentRecord?.auth}
          onCancel={hideDeleteModal}
          onConfirm={handleDeleteConfirmAction}
        />
      </div>
    </div>
  );
};

export default DaySentences;
