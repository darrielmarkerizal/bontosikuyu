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
  password: string;
  currentPassword?: string;
  confirmPassword: string;
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

export interface CreateAdminRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateAdminRequest {
  fullName: string;
  email: string;
  username: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data?: {
    admin: Admin;
    token?: string;
    expiresIn?: string;
  };
  error?: string;
  timestamp: string;
}
