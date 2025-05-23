export interface IApiSuccessResponse<T> {
  code: number;
  message: string;
  data: T;
}