import { renderHook } from '@testing-library/react';
import { message, notification } from 'antd';
import { useErrorHandler } from '../useErrorHandler';

// Mock antd components
jest.mock('antd', () => ({
  message: {
    error: jest.fn(),
  },
  notification: {
    error: jest.fn(),
  },
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  it('should handle Error objects correctly', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error message');

    const errorInfo = result.current.handleError(error);

    expect(errorInfo.message).toBe('Test error message');
    expect(message.error).toHaveBeenCalledWith('Test error message');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle error objects with custom properties', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = {
      message: 'Custom error',
      code: 400,
      details: { field: 'username' },
    };

    const errorInfo = result.current.handleError(error);

    expect(errorInfo.message).toBe('Custom error');
    expect(errorInfo.code).toBe(400);
    expect(message.error).toHaveBeenCalledWith('Custom error');
  });

  it('should handle string errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = 'String error message';

    const errorInfo = result.current.handleError(error);

    expect(errorInfo.message).toBe('String error message');
    expect(message.error).toHaveBeenCalledWith('String error message');
  });

  it('should respect options for showing notifications', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');

    result.current.handleError(error, {
      showMessage: false,
      showNotification: true,
    });

    expect(message.error).not.toHaveBeenCalled();
    expect(notification.error).toHaveBeenCalledWith({
      message: '操作失败',
      description: 'Test error',
      duration: 4.5,
    });
  });

  it('should handle API errors with different status codes', () => {
    const { result } = renderHook(() => useErrorHandler());

    const apiError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
      },
    };

    result.current.handleApiError(apiError);

    expect(message.error).toHaveBeenCalledWith('登录已过期，请重新登录');
  });

  it('should handle network errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    const networkError = {
      request: {},
      message: 'Network Error',
    };

    result.current.handleApiError(networkError);

    expect(message.error).toHaveBeenCalledWith('网络连接失败，请检查网络设置');
  });

  it('should handle async errors', async () => {
    const { result } = renderHook(() => useErrorHandler());

    const asyncFn = jest.fn().mockRejectedValue(new Error('Async error'));

    await expect(result.current.handleAsyncError(asyncFn)).rejects.toThrow('Async error');

    expect(message.error).toHaveBeenCalledWith('Async error');
    expect(asyncFn).toHaveBeenCalled();
  });
});
