export interface DashboardData {
  overview: {
    totalArticles: number;
    totalUmkm: number;
    totalTravels: number;
    totalWriters: number;
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    activeSessions: number;
  };
  recentActivity: {
    recentArticles: Array<{
      id: number;
      title: string;
      status: string;
      createdAt: string;
      writerName: string;
    }>;
    recentUmkm: Array<{
      id: number;
      umkmName: string;
      ownerName: string;
      dusun: string;
      createdAt: string;
    }>;
    recentTravels: Array<{
      id: number;
      name: string;
      dusun: string;
      createdAt: string;
    }>;
    topWriters: Array<{
      id: number;
      fullName: string;
      dusun: string;
      articleCount: number;
    }>;
    recentLogs: Array<{
      id: number;
      action: string;
      description: string;
      tableName: string;
      recordId: number | null;
      userId: number | null;
      ipAddress: string | null;
      createdAt: string;
    }>;
  };
  quickStats: {
    articlesByStatus: {
      published: number;
      draft: number;
    };
    umkmByDusun: Record<string, number>;
    travelsByDusun: Record<string, number>;
    writersByDusun: Record<string, number>;
    topPerformingArticles: Array<{
      id: number;
      title: string;
      pageViews: number;
    }>;
  };
  trafficInsights: {
    todayStats: {
      sessions: number;
      pageViews: number;
      uniqueVisitors: number;
    };
    weeklyGrowth: {
      sessions: number;
      pageViews: number;
    };
    deviceBreakdown: {
      mobile: number;
      desktop: number;
      tablet: number;
    };
    topPages: Array<{
      page: string;
      views: number;
    }>;
  };
  lastUpdated: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
  user: User;
  performance?: {
    queryTime: string;
    optimized: boolean;
  };
  timestamp: string;
}
