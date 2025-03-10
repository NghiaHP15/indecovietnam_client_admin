export interface Result<T = any> {
  isSuccess: string;
  message: number;
  data?: T;
}
