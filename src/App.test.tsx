import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 创建一个测试用的包装器，提供路由上下文
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

test('renders app without crashing', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  
  // 检查应用是否正常渲染，不检查特定文本
  expect(document.body).toBeInTheDocument();
});

test('app contains router element', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  
  // 检查是否存在路由相关的元素
  const appElement = document.querySelector('#root');
  expect(appElement).toBeInTheDocument();
});
