import { message } from 'antd';
import { ExportParams } from '../types';

/**
 * 文件下载处理
 */
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 生成带时间戳的文件名
 */
export const generateFilename = (baseName: string, extension: string = 'xlsx'): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${baseName}_${timestamp}.${extension}`;
};

/**
 * 统一的导出处理函数
 */
export const handleExport = async (
  exportApi: (params: ExportParams) => Promise<any>,
  params: ExportParams = {},
  filename: string,
  options: {
    showLoading?: boolean;
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) => {
  const {
    showLoading = true,
    loadingMessage = '正在导出...',
    successMessage = '导出成功',
    errorMessage = '导出失败',
  } = options;

  let hideLoading: (() => void) | null = null;

  try {
    // 显示加载提示
    if (showLoading) {
      hideLoading = message.loading(loadingMessage, 0);
    }

    // 调用导出API
    const response = await exportApi(params);

    // 创建Blob对象
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // 生成文件名（如果没有扩展名则添加）
    const finalFilename = filename.includes('.') ? filename : generateFilename(filename);

    // 下载文件
    downloadFile(blob, finalFilename);

    // 显示成功消息
    message.success(successMessage);
  } catch (error: any) {
    console.error('导出失败:', error);
    // 错误已在API拦截器处理，这里只记录日志
    if (!error.handled) {
      message.error(errorMessage);
    }
  } finally {
    // 隐藏加载提示
    if (hideLoading) {
      hideLoading();
    }
  }
};

/**
 * 批量导出处理
 */
export const handleBatchExport = async (
  exportConfigs: Array<{
    api: (params: any) => Promise<any>;
    params: any;
    filename: string;
  }>,
  options: {
    successMessage?: string;
    errorMessage?: string;
  } = {}
) => {
  const { successMessage = '批量导出完成', errorMessage = '批量导出失败' } = options;

  const hideLoading = message.loading('正在批量导出...', 0);

  try {
    const promises = exportConfigs.map(config =>
      handleExport(config.api, config.params, config.filename, { showLoading: false })
    );

    await Promise.all(promises);
    message.success(successMessage);
  } catch (error) {
    console.error('批量导出失败:', error);
    message.error(errorMessage);
  } finally {
    hideLoading();
  }
};

/**
 * 导出配置类型
 */
export interface ExportConfig {
  api: (params: any) => Promise<any>;
  filename: string;
  params?: any;
  permission?: string;
}

/**
 * 创建导出处理函数
 */
export const createExportHandler = (config: ExportConfig) => {
  return (additionalParams: any = {}) => {
    const finalParams = { ...config.params, ...additionalParams };
    return handleExport(config.api, finalParams, config.filename);
  };
};
