// src/components/logs/logs-types.ts
export interface Log {
  id: number;
  action: string;
  tableName: string | null;
  recordId: number | null;
  userId: number | null;
  oldValues: string | null;
  newValues: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LogsResponse {
  success: boolean;
  data: {
    logs: Log[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: {
      actionOptions: string[];
    };
  };
  message: string;
  timestamp: string;
}

// Tambahkan ini di akhir file:
export {};
