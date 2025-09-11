import apiClient from "../apiClient";

export enum NotificationApi {
  internalNotification = '/ws',
  notiReadAll = '/ws/read-all',
}

const getUnread = async (data: any = {}) => await apiClient.get({ url: NotificationApi.internalNotification, params: data })
const markAsRead = async (id: string) => await apiClient.get({ url: `${NotificationApi.internalNotification}/${id}` })
const notiReadAll = async () => await apiClient.get({ url: NotificationApi.notiReadAll })

export {
  getUnread,
  markAsRead,
  notiReadAll
};
