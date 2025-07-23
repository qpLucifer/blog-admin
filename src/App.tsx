import React from 'react';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import AppRouter from './router';
import AuthInitializer from './components/layout/AuthInitializer';
import { ErrorBoundary } from './components';

const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <AuthInitializer />
        <AppRouter />
      </ConfigProvider>
    </Provider>
  </ErrorBoundary>
);

export default App;
