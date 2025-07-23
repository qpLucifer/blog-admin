import { useCallback } from 'react';
import { message, notification } from 'antd';

interface ErrorHandlerOptions {
  showMessage?: boolean;
  showNotification?: boolean;
  logError?: boolean;
  reportError?: boolean;
}

interface ErrorInfo {
  message: string;
  code?: string | number;
  details?: any;
  stack?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback(
    (error: Error | ErrorInfo | any, options: ErrorHandlerOptions = {}) => {
      const {
        showMessage = true,
        showNotification = false,
        logError = true,
        reportError = false,
      } = options;

      // 标准化错误信息
      let errorInfo: ErrorInfo;

      if (error instanceof Error) {
        errorInfo = {
          message: error.message,
          stack: error.stack,
          details: error,
        };
      } else if (typeof error === 'object' && error !== null) {
        errorInfo = {
          message: error.message || error.msg || '未知错误',
          code: error.code || error.status,
          details: error,
        };
      } else {
        errorInfo = {
          message: String(error) || '未知错误',
          details: error,
        };
      }

      // 控制台日志
      if (logError) {
        console.error('Error handled:', errorInfo);
      }

      // 显示消息提示
      if (showMessage) {
        message.error(errorInfo.message);
      }

      // 显示通知
      if (showNotification) {
        notification.error({
          message: '操作失败',
          description: errorInfo.message,
          duration: 4.5,
        });
      }

      // 错误上报（可以集成第三方错误监控服务）
      if (reportError) {
        reportErrorToService(errorInfo);
      }

      return errorInfo;
    },
    []
  );

  const handleApiError = useCallback(
    (error: any) => {
      // API错误的特殊处理
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            message.error('登录已过期，请重新登录');
            // 这里可以触发登出逻辑
            break;
          case 403:
            message.error('权限不足，无法执行此操作');
            break;
          case 404:
            message.error('请求的资源不存在');
            break;
          case 500:
            message.error('服务器内部错误，请稍后重试');
            break;
          default:
            message.error(data?.message || '请求失败');
        }
      } else if (error.request) {
        message.error('网络连接失败，请检查网络设置');
      } else {
        message.error(error.message || '请求配置错误');
      }

      return handleError(error, { showMessage: false, logError: true });
    },
    [handleError]
  );

  const handleAsyncError = useCallback(
    async (asyncFn: () => Promise<any>, options?: ErrorHandlerOptions) => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, options);
        throw error; // 重新抛出错误，让调用者决定如何处理
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleApiError,
    handleAsyncError,
  };
};

// 错误上报函数（示例）
const reportErrorToService = (errorInfo: ErrorInfo) => {
  // 这里可以集成如 Sentry、LogRocket 等错误监控服务
  if (process.env.NODE_ENV === 'production') {
    // 生产环境才上报错误
    console.log('Reporting error to service:', errorInfo);
    // 实际的错误上报逻辑
  }
};

export default useErrorHandler;
