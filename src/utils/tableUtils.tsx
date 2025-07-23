import React from 'react';
import { Tag } from 'antd';
import { TableColumn } from '../types';
import { ActionButtons } from '../components';

/**
 * 创建通用的操作列
 * @param config 操作列配置
 * @returns 操作列配置
 */
export const createActionColumn = (config: {
  onEdit: (record: any) => void;
  onDelete: (record: any) => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  width?: number;
}): TableColumn => ({
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  width: config.width || 150,
  fixed: 'right' as const,
  render: (_: any, record: any) => (
    <ActionButtons
      record={record}
      onEdit={config.onEdit}
      onDelete={config.onDelete}
      editDisabled={config.editDisabled}
      deleteDisabled={config.deleteDisabled}
    />
  ),
});

/**
 * 创建通用的状态列
 * @param config 状态列配置
 * @returns 状态列配置
 */
export const createStatusColumn = (config: {
  dataIndex: string;
  width?: number;
  activeText?: string;
  inactiveText?: string;
  activeColor?: string;
  inactiveColor?: string;
}): TableColumn => ({
  title: '状态',
  dataIndex: config.dataIndex,
  width: config.width || 100,
  render: (status: boolean | number) => (
    <Tag color={status ? config.activeColor || 'green' : config.inactiveColor || 'red'}>
      {status ? config.activeText || '启用' : config.inactiveText || '禁用'}
    </Tag>
  ),
});

/**
 * 创建通用的时间列
 * @param config 时间列配置
 * @returns 时间列配置
 */
export const createTimeColumn = (config: {
  dataIndex: string;
  title?: string;
  width?: number;
}): TableColumn => ({
  title: config.title || '创建时间',
  dataIndex: config.dataIndex,
  width: config.width || 180,
  render: (time: string) => (time ? new Date(time).toLocaleString() : '-'),
});

/**
 * 创建通用的ID列
 * @param config ID列配置
 * @returns ID列配置
 */
export const createIdColumn = (
  config: {
    width?: number;
  } = {}
): TableColumn => ({
  title: 'ID',
  dataIndex: 'id',
  width: config.width || 80,
});
