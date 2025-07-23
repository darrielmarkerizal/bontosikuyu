export interface Admin {
  id: number;
  fullName: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFormData {
  fullName: string;
  email: string;
  username: string;
  password?: string;
  currentPassword?: string;
}

export interface AdminsResponse {
  success: boolean;
  message: string;
  data: {
    users: Admin[];
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
    appliedFilters: {
      search?: string;
    };
    appliedSort: {
      field: string;
      order: "ASC" | "DESC";
    };
    overallStats: {
      totalUsers: number;
    };
  };
  timestamp: string;
}
