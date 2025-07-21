export interface Writer {
  id: number;
  fullName: string;
  phoneNumber: string;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  createdAt: string;
  updatedAt: string;
}

export interface WriterFormData {
  fullName: string;
  phoneNumber: string;
  dusun: string;
}

export interface WritersResponse {
  success: boolean;
  message: string;
  data: {
    writers: Writer[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
    filters: {
      dusunOptions: string[];
      dusunCounts: Record<string, number>;
    };
    appliedFilters: {
      search?: string;
      dusun?: string;
    };
    appliedSort: {
      field: string;
      order: "ASC" | "DESC";
    };
    overallStats: {
      totalWriters: number;
      dusunCounts: Record<string, number>;
    };
  };
  timestamp: string;
}

export const dusunColors = {
  "Dusun Laiyolo": "bg-blue-100 text-blue-800",
  "Dusun Pangkaje'ne": "bg-green-100 text-green-800",
  "Dusun Timoro": "bg-yellow-100 text-yellow-800",
  "Dusun Kilotepo": "bg-purple-100 text-purple-800",
};
