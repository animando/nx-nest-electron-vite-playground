export type PagedResponse<T> = {
  data: T;
  meta: {
    count: number;
    nextToken?: string;
  };
};

export type PagedRequestMeta = {
  limit?: number;
  nextToken?: string;
};
