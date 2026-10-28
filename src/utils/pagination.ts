import { Request } from "express";

export interface Pagination { page: number; limit: number; offset: number; }

export function getPagination(req: Request): Pagination {
  const page = Math.max(1, parseInt(String(req.query.page)) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit)) || 10));
  return { page, limit, offset: (page - 1) * limit };
}

export function paginated<T>(data: T[], total: number, p: Pagination) {
  return { data, pagination: { page: p.page, limit: p.limit, total, totalPages: Math.ceil(total / p.limit) } };
}
