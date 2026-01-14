export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError<E = unknown> = {
  success: false;
  error: string;
  details?: E;
};

export type ApiResponse<T, E = unknown> = ApiSuccess<T> | ApiError<E>;

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pages: number;
};
