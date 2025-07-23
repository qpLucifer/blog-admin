import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 调用外部错误处理函数
    this.props.onError?.(error, errorInfo);

    // 这里可以添加错误上报逻辑
    // reportError(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误页面
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <Result
            status='500'
            title='页面出现错误'
            subTitle='抱歉，页面遇到了一些问题。请尝试刷新页面或返回首页。'
            extra={[
              <Button
                type='primary'
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
                key='reload'
              >
                刷新页面
              </Button>,
              <Button icon={<HomeOutlined />} onClick={this.handleGoHome} key='home'>
                返回首页
              </Button>,
            ]}
          />
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>错误详情（开发环境）</summary>
              <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
