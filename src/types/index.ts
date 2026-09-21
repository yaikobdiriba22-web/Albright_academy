// Albright Academy Shared Types

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type ApplicationStatus = 'New' | 'Reviewing' | 'Accepted' | 'Rejected';

export interface AdmissionApplication {
  id: string;
  referenceNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  applyingGrade: string; // e.g. "KG1", "KG2", "KG3", "Grade 1" ... "Grade 8"
  previousSchool?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  emergencyContact: string;
  additionalInformation?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type NewsStatus = 'Draft' | 'Published';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  status: NewsStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type EventStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface SchoolEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "02:00 PM"
  location: string;
  imageUrl?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export type GalleryCategory =
  | 'All'
  | 'School'
  | 'Classrooms'
  | 'Students'
  | 'Events'
  | 'Sports'
  | 'Activities';

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: GalleryCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  status?: 'Unread' | 'Read';
  createdAt: string;
  updatedAt: string;
}

export interface SchoolSettings {
  id: string;
  schoolName: string;
  slogan: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  latitude: number;
  longitude: number;
  facebookUrl: string;
  telegramUrl: string;
  youtubeUrl: string;
  facebook?: string;
  telegram?: string;
  youtube?: string;
  mission: string;
  vision: string;
  about: string;
  principalName: string;
  principalRole: string;
  principalMessage: string;
  principalPhotoUrl: string;
  updatedAt: string;
}

export interface AcademicLevel {
  id: string;
  title: string;
  subtitle: string;
  grades: string[];
  description: string;
  focusAreas: string[];
  imageUrl: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  publishedNews: number;
  upcomingEvents: number;
  unreadMessages: number;
  totalGalleryImages: number;
}
