export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  departmentId: number;
  department?: Department;
  studentId?: string;
  agreedTerms: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  departmentId: number;
  studentId?: string;
  agreedTerms: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  ideaSubmissionDeadline: string; // Backend field name
  commentDeadline: string; // Backend field name
  createdById: number;
  createdAt: string;
  isActive: boolean;
  categories?: Category[];
  ideaCount?: number;
  // Alias for compatibility
  closureDate?: string;
  finalClosureDate?: string;
}

export interface Idea {
  id: number;
  title: string;
  content: string;
  topicId: number;
  categoryId?: number;
  category?: Category;
  authorId?: number;
  author?: User;
  departmentId: number;
  department?: Department;
  isAnonymous: boolean;
  createdAt: string;
  viewCount: number;
  thumbsUpCount: number;
  thumbsDownCount: number;
  commentCount?: number;
  documents?: Document[];
}

export interface Comment {
  id: number;
  content: string;
  ideaId: number;
  authorId?: number;
  author?: User;
  authorName?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Reaction {
  id: number;
  ideaId: number;
  userId: number;
  isThumbsUp: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Document {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  ideaId: number;
}

export interface IdeaFormData {
  title: string;
  content: string;
  topicId: number;
  categoryId: number; // Required by backend
  isAnonymous: boolean;
}

export interface CommentFormData {
  content: string;
  isAnonymous: boolean;
}
