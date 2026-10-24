interface SingleResponse<T> {
  httpStatus: number;
  message: string;
  data: T;
}

interface SuccessResponse {
  httpStatus: number;
  message: string;
}

export { SingleResponse, SuccessResponse };
