export interface StatisticsOverview {
  totalSessions: number;
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalUniqueUsers: number;
  totalUsers: number;
  avgSessionDuration: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface UserStats {
  newUsers: number;
  returningUsers: number;
  userTypeBreakdown: {
    authenticated: number;
    anonymous: number;
  };
  totalUsers: number;
}

export interface DeviceStats {
  mobileUsers: number;
  desktopUsers: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
    unknown: number;
  };
}

export interface TrafficStats {
  botSessions: number;
  humanSessions: number;
  topCountries: Record<string, number>;
  exitPageStats: {
    exitPages: number;
    nonExitPages: number;
  };
}

export interface ContentStats {
  topPages: Array<{
    page: string;
    views: number;
    avgTime: number;
    uniqueVisitors: number;
  }>;
  avgTimeOnPage: number;
}

export interface ActivityStats {
  hourlyActivity: Array<{
    hour: number;
    sessions: number;
    pageViews: number;
  }>;
  dailyTrends: Array<{
    date: string;
    sessions: number;
    pageViews: number;
    uniqueVisitors: number;
    newUsers: number;
    bounceRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    sessions: number;
    pageViews: number;
    newUsers: number;
    avgSessionDuration: number;
  }>;
}

export interface RealtimeStats {
  activeNow: number;
  todaySessions: number;
  todayPageViews: number;
  todayNewUsers: number;
  last24hGrowth: {
    sessions: number;
    pageViews: number;
    users: number;
  };
}

export interface GeographicStats {
  totalCountries: number;
  totalCities: number;
  topCities: Record<string, number>;
}

export interface TemporalPatterns {
  weeklyPatterns: Array<{
    dayOfWeek: number;
    dayName: string;
    sessions: number;
    pageViews: number;
  }>;
  seasonalTrends: {
    currentPeriod: {
      sessions: number;
      pageViews: number;
      uniqueVisitors: number;
    };
  };
}

export interface StatisticsResponse {
  success: boolean;
  message: string;
  data: {
    overview: StatisticsOverview;
    userStats: UserStats;
    deviceStats: DeviceStats;
    trafficStats: TrafficStats;
    contentStats: ContentStats;
    activityStats: ActivityStats;
    realtimeStats: RealtimeStats;
    dateRange: {
      from: string;
      to: string;
      timeRange: string;
    };
    browserStats: Record<string, number>;
    osStats: Record<string, number>;
    geographicStats: GeographicStats;
    temporalPatterns: TemporalPatterns;
    performance: {
      queryTime: string;
      optimized: boolean;
    };
  };
  timestamp: string;
}
