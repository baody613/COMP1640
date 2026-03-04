/**
 * Barrel export for all services
 * Import all services from one place: import { ideaService, commentService } from './services';
 */

export { topicService } from "./topicService";
export type { TopicFormData } from "./topicService";
export { ideaService } from "./ideaService";
export { commentService } from "./commentService";
export { categoryService } from "./categoryService";
export { departmentService } from "./departmentService";
export { documentService } from "./documentService";
export { systemSettingsService } from "./systemSettingsService";
export { statisticsService } from "./statisticsService";
export { adminService } from "./adminService";

// Re-export types
export type { Document } from "./documentService";
export type { Department } from "./departmentService";
export type {
  SystemSettings,
  UpdateSettingDto,
  CreateSettingDto,
} from "./systemSettingsService";
export type {
  OverviewStatistics,
  DepartmentStatistics,
  CategoryStatistics,
  TopicStatistics,
  UserEngagementStatistics,
  TopContributor,
  TimelineStatistics,
} from "./statisticsService";
