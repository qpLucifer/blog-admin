import React from 'react';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import AppRouter from './router';
import AuthInitializer from './components/layout/AuthInitializer';

const App: React.FC = () => (
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <AuthInitializer />
      <AppRouter />
    </ConfigProvider>
  </Provider>
);

export default App;
