import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import AppRouter from './router';
import AuthInitializer from './components/layout/AuthInitializer';
import { ErrorBoundary } from './components';
import wsManager from './utils/websocket';
import { getToken } from './utils/auth';
import './styles/cool-effects.css';

const App: React.FC = () => {
  useEffect(() => {
    // 如果用户已登录，初始化WebSocket连接
    const token = getToken();
    if (token && !wsManager.isConnected()) {
      wsManager.connect();
    }

    // 清理函数
    return () => {
      wsManager.disconnect();
    };
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: '#667eea',
              colorSuccess: '#48bb78',
              colorWarning: '#ed8936',
              colorError: '#f56565',
              borderRadius: 12,
              colorBgContainer: 'rgba(255, 255, 255, 0.95)',
              colorBgElevated: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              boxShadowSecondary: '0 2px 8px rgba(102, 126, 234, 0.1)',
            },
            components: {
              Button: {
                borderRadius: 12,
                controlHeight: 40,
                fontWeight: 600,
              },
              Input: {
                borderRadius: 10,
                controlHeight: 40,
              },
              Select: {
                borderRadius: 10,
                controlHeight: 40,
              },
              Card: {
                borderRadius: 16,
              },
              Table: {
                borderRadius: 16,
                headerBg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              },
              Menu: {
                borderRadius: 8,
                itemBorderRadius: 8,
              },
            },
          }}
        >
          <AuthInitializer />
          <AppRouter />
        </ConfigProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
