export interface Umkm {
  id: number;
  umkmName: string;
  ownerName: string;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  phone: string;
  image?: string;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UmkmFormData {
  umkmName: string;
  ownerName: string;
  umkmCategoryId: number;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  phone: string;
  image?: string;
}

export interface UpdateUmkmRequest {
  umkmName: string;
  ownerName: string;
  umkmCategoryId: number;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  phone: string;
  image?: string;
}

export interface UmkmResponse {
  success: boolean;
  message: string;
  data: {
    umkm: Umkm[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: {
      categories: Array<{ id: number; name: string }>;
      dusunOptions: string[];
      dusunCounts: Record<string, number>;
    };
    overallStats: {
      totalUmkm: number;
      dusunCounts: Record<string, number>;
    };
  };
}
