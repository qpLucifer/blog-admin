/**
 * 博客相关类型定义
 * 包含博客、标签、评论、每日一句等相关类型
 */

import { BaseEntity } from './common';

// 博客数据
export interface BlogData extends BaseEntity {
  title: string;
  cover_image?: string;
  content: string;
  summary?: string;
  author_id: number;
  tags?: number[];
  views?: number;
  likes?: number;
  comments_count?: number;
  is_published?: boolean;
  is_choice?: boolean;
  need_time?: number;
}

// 创建博客数据
export interface CreateBlogData {
  title: string;
  cover_image?: string;
  content: string;
  summary?: string;
  author_id: number;
  tags?: number[];
  is_published?: boolean;
  is_choice?: boolean;
  need_time?: number;
}

// 更新博客数据
export interface UpdateBlogData {
  title?: string;
  cover_image?: string;
  content?: string;
  summary?: string;
  tags?: number[];
  is_published?: boolean;
  is_choice?: boolean;
  need_time?: number;
}

// 标签数据
export interface TagData extends BaseEntity {
  name: string;
}

// 创建标签数据
export interface CreateTagData {
  name: string;
}

// 更新标签数据
export interface UpdateTagData {
  name?: string;
}

// 评论数据
export interface CommentData extends BaseEntity {
  blog_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
  reply_count?: number; // 回复数量（仅主评论有此字段）
  is_replied?: boolean; // 是否已回复
}

// 创建评论数据
export interface CreateCommentData {
  blog_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
}

// 更新评论数据
export interface UpdateCommentData {
  content?: string;
}

// 每日一句数据
export interface DaySentence extends BaseEntity {
  day_sentence: string;
  auth: string;
}

// 创建每日一句数据
export interface CreateDaySentenceData {
  day_sentence: string;
  auth: string;
}

// 更新每日一句数据
export interface UpdateDaySentenceData {
  day_sentence?: string;
  auth?: string;
}

// 博客查询参数
export interface BlogQueryParams {
  currentPage?: number;
  pageSize?: number;
  title?: string;
  is_published?: number;
  is_choice?: number;
  author_id?: string;
}

// 标签查询参数
export interface TagQueryParams {
  currentPage?: number;
  pageSize?: number;
  name?: string;
}

// 评论查询参数
export interface CommentQueryParams {
  currentPage?: number;
  pageSize?: number;
  content?: string;
  user_id?: string;
  blog_id?: number;
  parent_id?: number | string | null;
}

// 每日一句查询参数
export interface DaySentenceQueryParams {
  currentPage?: number;
  pageSize?: number;
  auth?: string;
  day_sentence?: string;
}

// 评论树节点类型
export interface CommentTreeNode extends CommentData {
  key: number;
  title: string;
  children?: CommentTreeNode[];
}

// 博客统计信息
export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

// WebSocket博客相关类型
export interface BlogStats {
  totalBlogs: number;
  totalViews: number;
}

export interface BlogViewUpdate {
  blogId: number;
  viewCount: number;
  timestamp: string;
}

export interface BlogTotal {
  totalBlogs: number;
}
