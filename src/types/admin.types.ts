import { MentorApprovalStatus } from "@prisma/client";

export interface UpdateMentorStatusDto {
  status: MentorApprovalStatus;
  reviewNotes?: string;
}
