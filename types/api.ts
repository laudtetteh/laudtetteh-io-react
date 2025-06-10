export interface ApiResponse<T> {
  data: T;
  message?: string;
}
 
export interface ErrorResponse {
  detail: string;
  [key: string]: any;
} 