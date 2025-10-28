export interface ApiResponse<T = unknown> {
  ok: boolean
  data?: T
  message?: string
  error?: string
  total?: number
  page?: number
  limit?: number
}

export class ApiError extends Error {
  public status: number
  public data: unknown

  constructor(message: string, status: number = 0, data: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  q?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
