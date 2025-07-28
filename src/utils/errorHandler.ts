/**
 * 错误处理工具
 * 提供统一的错误处理、日志记录和用户提示
 */

import { message, notification } from 'antd';

// 错误类型枚举
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN',
}

// 错误级别枚举
export enum ErrorLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType;
  level: ErrorLevel;
  message: string;
  code?: string | number;
  details?: any;
  timestamp?: number;
  userId?: string;
  url?: string;
  userAgent?: string;
}

// 错误处理配置
interface ErrorHandlerConfig {
  showNotification?: boolean;
  showMessage?: boolean;
  logToConsole?: boolean;
  logToServer?: boolean;
  autoReport?: boolean;
}

class ErrorHandler {
  private config: ErrorHandlerConfig = {
    showNotification: true,
    showMessage: true,
    logToConsole: true,
    logToServer: false,
    autoReport: false,
  };

  /**
   * 设置错误处理配置
   */
  setConfig(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 处理错误
   */
  handle(error: any, customConfig?: Partial<ErrorHandlerConfig>): void {
    const config = { ...this.config, ...customConfig };
    const errorInfo = this.parseError(error);

    // 控制台日志
    if (config.logToConsole) {
      this.logToConsole(errorInfo);
    }

    // 用户提示
    if (config.showMessage || config.showNotification) {
      this.showUserNotification(errorInfo, config);
    }

    // 服务器日志
    if (config.logToServer) {
      this.logToServer(errorInfo);
    }

    // 自动报告
    if (config.autoReport && errorInfo.level === ErrorLevel.CRITICAL) {
      this.reportError(errorInfo);
    }
  }

  /**
   * 解析错误信息
   */
  private parseError(error: any): ErrorInfo {
    const errorInfo: ErrorInfo = {
      type: ErrorType.UNKNOWN,
      level: ErrorLevel.MEDIUM,
      message: '未知错误',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    if (error?.response) {
      // API错误
      errorInfo.type = ErrorType.API;
      errorInfo.code = error.response.status;
      errorInfo.message = error.response.data?.message || error.message || 'API请求失败';

      // 根据状态码设置错误级别
      if (error.response.status >= 500) {
        errorInfo.level = ErrorLevel.HIGH;
      } else if (error.response.status === 401 || error.response.status === 403) {
        errorInfo.type = ErrorType.PERMISSION;
        errorInfo.level = ErrorLevel.MEDIUM;
      }
    } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      // 网络错误
      errorInfo.type = ErrorType.NETWORK;
      errorInfo.message = '网络连接超时，请检查网络设置';
      errorInfo.level = ErrorLevel.MEDIUM;
    } else if (error?.name === 'ValidationError') {
      // 验证错误
      errorInfo.type = ErrorType.VALIDATION;
      errorInfo.message = error.message || '数据验证失败';
      errorInfo.level = ErrorLevel.LOW;
    } else if (error instanceof Error) {
      // JavaScript错误
      errorInfo.message = error.message;
      errorInfo.details = {
        stack: error.stack,
        name: error.name,
      };
      errorInfo.level = ErrorLevel.HIGH;
    } else if (typeof error === 'string') {
      errorInfo.message = error;
    }

    return errorInfo;
  }

  /**
   * 控制台日志
   */
  private logToConsole(errorInfo: ErrorInfo): void {
    const logMethod =
      errorInfo.level === ErrorLevel.CRITICAL
        ? 'error'
        : errorInfo.level === ErrorLevel.HIGH
          ? 'error'
          : errorInfo.level === ErrorLevel.MEDIUM
            ? 'warn'
            : 'log';

    console[logMethod]('Error Handler:', {
      ...errorInfo,
      timestamp: new Date(errorInfo.timestamp!).toISOString(),
    });
  }

  /**
   * 显示用户通知
   */
  private showUserNotification(errorInfo: ErrorInfo, config: ErrorHandlerConfig): void {
    const { level, message: errorMessage } = errorInfo;

    if (level === ErrorLevel.CRITICAL || level === ErrorLevel.HIGH) {
      if (config.showNotification) {
        notification.error({
          message: '系统错误',
          description: errorMessage,
          duration: 0, // 不自动关闭
        });
      }
    } else {
      if (config.showMessage) {
        message.error(errorMessage);
      }
    }
  }

  /**
   * 服务器日志（可扩展）
   */
  private async logToServer(errorInfo: ErrorInfo): Promise<void> {
    try {
      // 这里可以调用日志API
      // await api.post('/api/logs/error', errorInfo);
      console.log('Would log to server:', errorInfo);
    } catch (err) {
      console.error('Failed to log error to server:', err);
    }
  }

  /**
   * 错误报告（可扩展）
   */
  private async reportError(errorInfo: ErrorInfo): Promise<void> {
    try {
      // 这里可以集成错误监控服务，如Sentry
      console.log('Would report critical error:', errorInfo);
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  }
}

// 创建全局错误处理器实例
export const errorHandler = new ErrorHandler();

// 便捷方法
export const handleError = (error: any, config?: Partial<ErrorHandlerConfig>) => {
  errorHandler.handle(error, config);
};

// 特定类型错误处理
export const handleApiError = (error: any) => {
  handleError(error, { showMessage: true, showNotification: false });
};

export const handleNetworkError = (error: any) => {
  handleError(error, { showNotification: true, showMessage: false });
};

export const handleValidationError = (error: any) => {
  handleError(error, { showMessage: true, showNotification: false, logToConsole: false });
};

export const handleCriticalError = (error: any) => {
  handleError(error, {
    showNotification: true,
    showMessage: false,
    logToServer: true,
    autoReport: true,
  });
};

export default errorHandler;
