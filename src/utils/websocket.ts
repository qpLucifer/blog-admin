// utils/websocket.ts - WebSocket客户端管理
import { io, Socket } from 'socket.io-client';
import { message } from 'antd';
import { getToken } from './auth';

export interface ErrorLogData {
  id: number;
  username: string;
  action: string;
  module: string;
  target_name: string;
  ip_address: string;
  status: string;
  details: string;
  created_at: string;
  timestamp: string;
}

export interface BlogStats {
  totalBlogs: number;
  totalViews: number;
}

export interface BlogViewUpdate {
  blogId: number;
  viewCount: number;
  timestamp: string;
}

export interface StatsData {
  onlineUsers: number;
  totalBlogs: number;
  totalViews: number;
  pendingComments: number;
}

class WebSocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private listeners: Map<string, Function[]> = new Map();

  // 连接WebSocket
  connect() {
    const token = getToken();
    if (!token) {
      console.warn('未找到认证令牌，无法连接WebSocket');
      return;
    }

    const serverUrl = process.env.REACT_APP_WS_URL || 'http://localhost:3000';

    this.socket = io(serverUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
  }

  // 设置事件监听器
  private setupEventListeners() {
    if (!this.socket) return;

    // 连接成功
    this.socket.on('connect', () => {
      console.log('✅ WebSocket连接成功');
      this.reconnectAttempts = 0;
      message.success('实时连接已建立');
    });

    // 连接错误
    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ WebSocket连接失败:', error.message);
      this.handleReconnect();
    });

    // 断开连接
    this.socket.on('disconnect', (reason: string) => {
      console.warn('⚠️ WebSocket连接断开:', reason);
      if (reason === 'io server disconnect') {
        // 服务器主动断开，尝试重连
        this.handleReconnect();
      }
    });

    // 错误日志推送
    this.socket.on('log:error', (data: ErrorLogData) => {
      console.log('收到错误日志:', data);
      message.error(`系统错误: ${data.module} - ${data.target_name}`);
      this.emit('errorLog', data);
    });

    // 统计数据更新
    this.socket.on('stats:update', (data: StatsData) => {
      this.emit('statsUpdate', data);
    });

    // 在线用户数更新
    this.socket.on('stats:onlineUsers', (count: number) => {
      this.emit('onlineUsersUpdate', count);
    });

    // 博客统计更新
    this.socket.on('stats:blogs', (data: BlogStats) => {
      this.emit('blogStatsUpdate', data);
    });

    // 博客访问量更新
    this.socket.on('blog:viewUpdate', (data: BlogViewUpdate) => {
      this.emit('blogViewUpdate', data);
    });

    // 心跳响应
    this.socket.on('pong', () => {
      // 心跳响应处理
      console.log('收到心跳响应');
    });
  }

  // 处理重连
  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      message.error('WebSocket连接失败，请刷新页面重试');
      return;
    }

    this.reconnectAttempts++;
    console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // 添加事件监听器
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // 移除事件监听器
  off(event: string, callback?: Function) {
    if (!this.listeners.has(event)) return;

    if (callback) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  // 触发事件
  private emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('WebSocket事件处理错误:', error);
        }
      });
    }
  }

  // 发送心跳
  ping() {
    if (this.socket && this.socket.connected) {
      this.socket.emit('ping');
    }
  }

  // 检查连接状态
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// 创建单例实例
const wsManager = new WebSocketManager();

export default wsManager;
