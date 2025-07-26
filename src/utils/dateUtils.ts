import dayjs from 'dayjs';

/**
 * 日期格式化工具函数
 */

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @param format 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串，如果日期无效则返回 '-'
 */
export const formatDateTime = (
  date: string | Date | null | undefined,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  if (!date) return '-';

  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return '-';
    return dayjsDate.format(format);
  } catch (error) {
    console.warn('日期格式化失败:', error);
    return '-';
  }
};

/**
 * 格式化日期（不包含时间）
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串 YYYY-MM-DD
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  return formatDateTime(date, 'YYYY-MM-DD');
};

/**
 * 格式化时间（不包含日期）
 * @param date 日期字符串或Date对象
 * @returns 格式化后的时间字符串 HH:mm:ss
 */
export const formatTime = (date: string | Date | null | undefined): string => {
  return formatDateTime(date, 'HH:mm:ss');
};

/**
 * 格式化为相对时间
 * @param date 日期字符串或Date对象
 * @returns 相对时间字符串，如 "2小时前"、"3天前"
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';

  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return '-';

    const now = dayjs();
    const diffInMinutes = now.diff(dayjsDate, 'minute');
    const diffInHours = now.diff(dayjsDate, 'hour');
    const diffInDays = now.diff(dayjsDate, 'day');

    if (diffInMinutes < 1) {
      return '刚刚';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else if (diffInDays < 30) {
      return `${diffInDays}天前`;
    } else {
      return formatDateTime(date, 'YYYY-MM-DD');
    }
  } catch (error) {
    console.warn('相对时间格式化失败:', error);
    return '-';
  }
};

/**
 * 检查日期是否为今天
 * @param date 日期字符串或Date对象
 * @returns 是否为今天
 */
export const isToday = (date: string | Date | null | undefined): boolean => {
  if (!date) return false;

  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return false;
    return dayjsDate.isSame(dayjs(), 'day');
  } catch (error) {
    return false;
  }
};

/**
 * 检查日期是否为昨天
 * @param date 日期字符串或Date对象
 * @returns 是否为昨天
 */
export const isYesterday = (date: string | Date | null | undefined): boolean => {
  if (!date) return false;

  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return false;
    return dayjsDate.isSame(dayjs().subtract(1, 'day'), 'day');
  } catch (error) {
    return false;
  }
};

/**
 * 获取友好的日期显示
 * @param date 日期字符串或Date对象
 * @returns 友好的日期字符串，如 "今天 14:30"、"昨天 09:15"、"2024-01-15 16:20"
 */
export const formatFriendlyDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';

  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return '-';

    if (isToday(date)) {
      return `今天 ${dayjsDate.format('HH:mm')}`;
    } else if (isYesterday(date)) {
      return `昨天 ${dayjsDate.format('HH:mm')}`;
    } else {
      return formatDateTime(date, 'YYYY-MM-DD HH:mm');
    }
  } catch (error) {
    console.warn('友好日期格式化失败:', error);
    return '-';
  }
};
