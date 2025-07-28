import { useState, useCallback } from 'react';
import { message } from 'antd';
import { handleApiError } from '../utils/errorHandler';

interface UseApiOptions {
  showError?: boolean; // 是否显示错误提示
  showSuccess?: boolean; // 是否显示成功提示
  successMessage?: string; // 成功提示信息
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * 通用API调用Hook
 * @param apiFunction API函数
 * @param options 配置选项
 * @returns 包含数据、加载状态、错误信息和执行函数的对象
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => any,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { showError = true, showSuccess = false, successMessage = '操作成功' } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);
        setData(result);

        if (showSuccess) {
          message.success(successMessage || '操作成功');
        }

        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || '操作失败';
        setError(errorMessage);

        // 使用新的错误处理系统
        if (showError && !err.handled) {
          handleApiError(err);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, showError, showSuccess, successMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * 获取错误信息的工具函数
 * @param error 错误对象
 * @returns 错误信息字符串
 */
export function getErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return '操作失败';
}
