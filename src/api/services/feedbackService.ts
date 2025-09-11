import apiClient from "../apiClient";

export enum FeedbackApi {
  internalFeedback = '/feedback',
}

const internalFeedback = async (data: any = {}) => await apiClient.get({ url: FeedbackApi.internalFeedback, params: data })
const getFeedback = async (id: string) => await apiClient.get({ url: `${FeedbackApi.internalFeedback}/${id}` })
const createFeeback = async (data: any = {}) => await apiClient.post({ url: FeedbackApi.internalFeedback, data })
const updateFeedback = async (id: string, data: any = {}) => await apiClient.put({ url: `${FeedbackApi.internalFeedback}/${id}`, data: data})
const deleteFeedback = async (id: string) => await apiClient.delete({ url: `${FeedbackApi.internalFeedback}/${id}`})

export {
  internalFeedback,
  createFeeback,
  updateFeedback,
  deleteFeedback,
  getFeedback
};
