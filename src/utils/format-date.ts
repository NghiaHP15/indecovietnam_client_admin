import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateTime = (date: string): string => dayjs(date).tz('Asia/Ho_Chi_Minh').format("hh:mm DD/MM/YYYY");
export const formatDate = (date: string): string => dayjs.utc(date).tz('Asia/Ho_Chi_Minh').format("DD/MM/YYYY");
export const formatTime = (date: string): string => dayjs.utc(date).tz('Asia/Ho_Chi_Minh').format("hh:mm");
export const formatUTC = (date: string): string => dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS")