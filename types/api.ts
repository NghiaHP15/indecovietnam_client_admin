export interface Result<T = any> {
  success: string;
  message: number;
  data?: T;
}
