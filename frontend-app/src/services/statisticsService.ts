import apiClient from "../api";

// Statistics DTOs
export interface OverviewStatistics {
  totalIdeas: number;
  totalComments: number;
  totalUsers: number;
  totalDepartments: number;
}

export interface DepartmentStatistics {
  departmentId: number;
  departmentName: string;
  departmentCode: string;
  staffCount: number;
  ideaCount: number;
  commentCount: number;
  totalViews: number;
}

export interface CategoryStatistics {
  categoryId: number;
  categoryName: string;
  ideaCount: number;
  commentCount: number;
  thumbsUpCount: number;
  thumbsDownCount: number;
}

export interface TopicStatistics {
  topicId: number;
  topicName: string;
  ideaCount: number;
  commentCount: number;
  totalViews: number;
  participantCount: number;
  ideaSubmissionDeadline: string;
  commentDeadline: string;
  isActive: boolean;
}

export interface UserEngagementStatistics {
  userId: number;
  userName: string;
  ideasSubmitted: number;
  commentsPosted: number;
  reactionsGiven: number;
  totalViewsReceived: number;
}

export interface TopContributor {
  userId: number;
  userName: string;
  departmentName: string;
  ideasCount: number;
  commentsCount: number;
  totalEngagement: number;
}

export interface TimelineStatistics {
  date: string;
  ideaCount: number;
  commentCount: number;
}

export const statisticsService = {
  // Get overview statistics
  async getOverview(): Promise<OverviewStatistics> {
    const response = await apiClient.get<OverviewStatistics>(
      "/Statistics/overview",
    );
    return response.data;
  },

  // Get department statistics
  async getDepartmentStatistics(): Promise<DepartmentStatistics[]> {
    const response = await apiClient.get<DepartmentStatistics[]>(
      "/Statistics/departments",
    );
    return response.data;
  },

  // Get ideas by category
  async getIdeasByCategory(topicId?: number): Promise<CategoryStatistics[]> {
    const url = topicId
      ? `/Statistics/ideas-by-category?topicId=${topicId}`
      : "/Statistics/ideas-by-category";
    const response = await apiClient.get<CategoryStatistics[]>(url);
    return response.data;
  },

  // Get ideas by topic
  async getIdeasByTopic(): Promise<TopicStatistics[]> {
    const response = await apiClient.get<TopicStatistics[]>(
      "/Statistics/ideas-by-topic",
    );
    return response.data;
  },

  // Get user engagement
  async getUserEngagement(userId: number): Promise<UserEngagementStatistics> {
    const response = await apiClient.get<UserEngagementStatistics>(
      `/Statistics/user-engagement/${userId}`,
    );
    return response.data;
  },

  // Get top contributors
  async getTopContributors(topN: number = 10): Promise<TopContributor[]> {
    const response = await apiClient.get<TopContributor[]>(
      `/Statistics/top-contributors?topN=${topN}`,
    );
    return response.data;
  },

  // Get ideas timeline
  async getIdeasTimeline(
    topicId?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<TimelineStatistics[]> {
    const params = new URLSearchParams();
    if (topicId) params.append("topicId", topicId.toString());
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const url = `/Statistics/ideas-timeline${params.toString() ? "?" + params.toString() : ""}`;
    const response = await apiClient.get<TimelineStatistics[]>(url);
    return response.data;
  },
};
