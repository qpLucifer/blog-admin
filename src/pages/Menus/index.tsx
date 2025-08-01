import React, { useState } from 'react';
import { Tree, Empty, message, Form, Input } from 'antd';
import styles from './index.module.css';
import pageStyles from '../../styles/page-layout.module.css';
import { TableColumn, Menu, MenuQueryParams } from '../../types';
import { useApi, useCrud, useInitialEffect } from '../../hooks';
import { useMenuPermission } from '../../hooks/useMenuPermission';
import {
  FormModal,
  DeleteModal,
  MenuForm,
  CommonTable,
  ActionButtons,
  SearchCard,
  TableToolbar,
  TableContainer,
} from '../../components';
import { getMenuTree, addMenu, updateMenu, deleteMenu, exportMenus } from '../../api/menu';
import { createExportHandler } from '../../utils/exportUtils';

const Menus: React.FC = () => {
  const [form] = Form.useForm();
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [searchParams, setSearchParams] = useState<Pick<MenuQueryParams, 'name' | 'path'>>({
    name: '',
    path: '',
  });

  // 获取菜单树
  const {
    data: menuTree,
    loading: treeLoading,
    error: treeError,
    execute: fetchMenuTree,
  } = useApi<Menu[]>(() => getMenuTree(searchParams), { showError: false });

  // 当前选中的菜单id
  const [selectedKey, setSelectedKey] = React.useState<number | null>(null);

  // 当搜索参数变化时重新获取数据
  useInitialEffect(() => {
    fetchMenuTree();
  }, [searchParams.name, searchParams.path]);

  // 选中树节点时，右侧表格只显示该节点的children
  const getTableData = () => {
    if (!selectedKey) return menuTree || [];
    // 在树中查找选中节点
    const findNode = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.id === selectedKey) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    const node = findNode(menuTree || []);
    return node && node.children ? node.children : [];
  };

  // 拖拽排序处理（支持order字段）
  const handleTreeDrop = async (info: any) => {
    const dropNode = info.node;
    const dropToGap = info.dropToGap;
    const dragNode = info.dragNode;
    // 禁止拖到自己或自己子孙节点下
    const isDescendant = (drag: any, drop: any) => {
      if (!drop.children) return false;
      for (const child of drop.children) {
        if (child.id === drag.id) return true;
        if (isDescendant(drag, child)) return true;
      }
      return false;
    };
    if (dragNode.key === dropNode.key || isDescendant(dragNode, dropNode)) {
      message.error('不能拖到自己或自己的子菜单下');
      return;
    }
    // 计算新的 parent_id
    let newParentId = null;
    let newOrder = 0;
    let siblings: any[] = [];
    // 辅助函数：查找节点
    const findNodeById = (id: number, nodes: any[]): any => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNodeById(id, node.children);
          if (found) return found;
        }
      }
      return null;
    };
    // 1. 拖到某节点内部（变成子节点）
    if (!dropToGap) {
      newParentId = dropNode.key;
      const parent = findNodeById(newParentId, menuTree || []);
      siblings =
        parent && parent.children ? parent.children.filter((c: any) => c.id !== dragNode.key) : [];
      newOrder = siblings.length; // 放到最后
    } else {
      // 2. 拖到某节点前/后（同级排序）
      newParentId = dropNode.parent_id ?? null;
      // 找到同级所有节点
      const parent = newParentId
        ? findNodeById(newParentId, menuTree || [])
        : { children: menuTree };
      siblings =
        parent && parent.children ? parent.children.filter((c: any) => c.id !== dragNode.key) : [];
      // 找到目标节点在同级中的索引
      const dropIndex = siblings.findIndex((c: any) => c.id === dropNode.key);
      if (dropIndex === -1) {
        newOrder = siblings.length;
      } else {
        newOrder = dropToGap
          ? dropIndex + (info.dropPosition > info.node.pos.split('-').length - 1 ? 1 : 0)
          : dropIndex;
      }
    }
    // 重新排序同级所有节点
    siblings.splice(newOrder, 0, { ...dragNode, id: dragNode.key });
    // 依次更新所有兄弟节点的order
    for (let i = 0; i < siblings.length; i++) {
      await updateMenu(siblings[i].id, { parent_id: newParentId, order: i });
    }
    message.success('菜单拖拽排序成功');
    fetchMenuTree();
  };

  // 确保children字段为数组或不传
  const normalizeTree = (nodes: any[]): any[] =>
    nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      return {
        ...node,
        children: hasChildren ? normalizeTree(node.children) : undefined,
      };
    });

  const { hasPermission } = useMenuPermission();

  // 创建导出处理函数
  const handleExport = createExportHandler({
    api: exportMenus as (params: any) => Promise<any>,
    filename: '菜单列表',
    params: {
      name: searchParams.name || undefined,
      path: searchParams.path || undefined,
    },
  });

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
  } = useCrud<Menu>({
    createApi: addMenu,
    updateApi: updateMenu,
    deleteApi: deleteMenu,
    createSuccessMessage: '菜单创建成功',
    updateSuccessMessage: '菜单更新成功',
    deleteSuccessMessage: '菜单删除成功',
    onSuccess: () => {
      // 操作成功后刷新列表
      fetchMenuTree();
    },
  });

  // 处理编辑
  function handleEdit(record: Menu) {
    showEditModal(record);
  }

  // 处理删除
  function handleDelete(record: Menu) {
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

  // 处理删除确认
  const handleDeleteConfirmAction = async () => {
    await handleDeleteConfirm();
  };

  // 处理搜索
  const onFinish = (values: any) => {
    setSearchParams(values);
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setSearchParams({
      name: '',
      path: '',
    });
  };

  // 获取表单初始值
  const getInitialValues = () => {
    if (!currentRecord) return {};
    return {
      name: currentRecord.name,
      path: currentRecord.path,
      order: currentRecord.order,
      icon: currentRecord.icon,
      parent_id: currentRecord.parent_id ?? null,
    };
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '菜单名', dataIndex: 'name', width: 120 },
    { title: '路径', dataIndex: 'path', width: 200 },
    { title: '排序', dataIndex: 'order', width: 80 },
    { title: '图标', dataIndex: 'icon', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
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
  return (
    <div className={`${styles.root} ${pageStyles.pageContainer}`}>
      <div className={pageStyles.pageContent}>
        {/* 搜索区域 */}
        <SearchCard
          title='查询条件'
          form={form}
          onFinish={onFinish}
          onReset={handleReset}
          loading={treeLoading}
          collapsed={searchCollapsed}
          onToggleCollapse={() => setSearchCollapsed(!searchCollapsed)}
        >
          <Form.Item name='name' label='菜单名'>
            <Input allowClear placeholder='输入菜单名' style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name='path' label='路径'>
            <Input allowClear placeholder='输入路径' style={{ width: 160 }} />
          </Form.Item>
        </SearchCard>

        {/* 操作栏 */}
        <TableToolbar
          title='菜单管理'
          showAdd={hasPermission('create')}
          addButtonText='新增菜单'
          onAdd={showCreateModal}
          onReload={fetchMenuTree}
          onExport={handleExport}
          loading={treeLoading}
          selectedRowKeys={[]}
          operations={{
            create: hasPermission('create'),
            export: hasPermission('read'),
          }}
        />

        <div style={{ display: 'flex', gap: 24 }}>
          {/* 左侧树形菜单 */}
          <div style={{ width: 260, background: '#fff' }}>
            {menuTree && menuTree.length > 0 ? (
              <Tree
                treeData={normalizeTree(menuTree)}
                fieldNames={{ title: 'name', key: 'id', children: 'children' }}
                onSelect={keys => setSelectedKey(keys[0] as number)}
                selectedKeys={selectedKey ? [selectedKey] : []}
                defaultExpandAll
                showIcon={false}
                draggable
                onDrop={handleTreeDrop}
                style={{ width: '100%' }}
              />
            ) : (
              <Empty description='暂无菜单' />
            )}
          </div>
          {/* 右侧表格 */}
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <TableContainer loading={treeLoading} className={styles.tableContainer}>
              <CommonTable
                columns={columns as TableColumn[]}
                dataSource={getTableData()}
                rowKey='id'
                pagination={{}}
                loading={treeLoading}
                error={treeError}
                scroll={{ x: 800 }}
              />
            </TableContainer>
          </div>
        </div>
        {/* 新增/编辑弹窗 */}
        <FormModal
          title={isEdit ? '编辑菜单' : '新增菜单'}
          visible={modalVisible}
          loading={crudLoading}
          initialValues={getInitialValues()}
          onCancel={hideModal}
          onSubmit={handleSubmit}
          width={600}
        >
          <MenuForm menus={menuTree || []} currentId={isEdit ? currentRecord?.id : null} />
        </FormModal>
        {/* 删除确认弹窗 */}
        <DeleteModal
          visible={deleteModalVisible}
          loading={crudLoading}
          recordName={currentRecord?.name}
          onCancel={hideDeleteModal}
          onConfirm={handleDeleteConfirmAction}
        />
      </div>
    </div>
  );
};

export default Menus;
