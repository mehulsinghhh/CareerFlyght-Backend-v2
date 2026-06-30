import { MentorApprovalStatus } from "@prisma/client";

export interface UpdateMentorStatusDto {
  status: MentorApprovalStatus;
  reviewNotes?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalMentors: number;
  pendingMentors: number;
  approvedMentors: number;
  rejectedMentors: number;
  totalBookings: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}
