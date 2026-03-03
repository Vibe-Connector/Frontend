import client from './client';
import type { PageResponse } from './types';

// ── Backend Notification DTOs 매칭 ──

export interface NotificationResponse {
  notificationId: number;
  type: string;
  title: string;
  body: string;
  linkUrl: string | null;
  referenceId: number | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// ── API 함수 ──

// GET /api/v1/notifications
export const getNotifications = (cursor?: string, size = 20): Promise<PageResponse<NotificationResponse>> =>
  client.get('/notifications', { params: { cursor, size } });

// GET /api/v1/notifications/unread-count
export const getUnreadCount = (): Promise<UnreadCountResponse> =>
  client.get('/notifications/unread-count');

// PUT /api/v1/notifications/{notificationId}/read
export const markAsRead = (notificationId: number): Promise<NotificationResponse> =>
  client.put(`/notifications/${notificationId}/read`);

// PUT /api/v1/notifications/read-all
export const markAllAsRead = (): Promise<void> =>
  client.put('/notifications/read-all');

// DELETE /api/v1/notifications/{notificationId}
export const deleteNotification = (notificationId: number): Promise<void> =>
  client.delete(`/notifications/${notificationId}`);
