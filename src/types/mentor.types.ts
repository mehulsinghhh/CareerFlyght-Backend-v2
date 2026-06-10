export interface CreateMentorProfileDto {
  company?: string;
  designation?: string;
  experienceYears?: number;
  bio?: string;
  linkedinUrl?: string;
  hourlyRate?: number;
}

export interface MentorFilters {
  company?: string;
  minExperience?: string;
  maxRate?: string;
}