export interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: ResponseData<T>;
  metaData: Record<string, unknown> | null;
}

export interface ApiSingleResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T;
  metaData: Record<string, unknown> | null;
}

export interface ResponseData<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
