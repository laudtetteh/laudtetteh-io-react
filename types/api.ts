export interface ApiResponse {
  data: Record<string, unknown>;
  message?: string;
}

export interface ErrorResponse {
  detail: string;
  [key: string]: string | number | boolean | null | undefined;
}
