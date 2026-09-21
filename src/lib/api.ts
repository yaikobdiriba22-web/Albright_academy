import {
  AdmissionApplication,
  ContactMessage,
  DashboardStats,
  GalleryCategory,
  GalleryImage,
  NewsItem,
  SchoolEvent,
  SchoolSettings,
} from '../types/index.ts';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('albright_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Public
  async getSettings(): Promise<SchoolSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch school settings');
    return res.json();
  },

  async getNews(): Promise<NewsItem[]> {
    const res = await fetch(`${API_BASE}/news`);
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },

  async getNewsItem(slug: string): Promise<NewsItem> {
    const res = await fetch(`${API_BASE}/news/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch article');
    return res.json();
  },

  async getEvents(): Promise<SchoolEvent[]> {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async getGallery(category?: GalleryCategory): Promise<GalleryImage[]> {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/gallery${query}`);
    if (!res.ok) throw new Error('Failed to fetch gallery images');
    return res.json();
  },

  async submitAdmission(data: Partial<AdmissionApplication>): Promise<{
    message: string;
    referenceNumber: string;
    application: AdmissionApplication;
  }> {
    const res = await fetch(`${API_BASE}/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit admission application');
    return json;
  },

  async submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ message: string; id: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit contact message');
    return json;
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Invalid credentials');
    localStorage.setItem('albright_admin_token', json.token);
    return json;
  },

  async getMe(): Promise<{ user: any }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async checkAuth(): Promise<{ authenticated: boolean; user?: any }> {
    try {
      const res = await this.getMe();
      return { authenticated: true, user: res.user };
    } catch {
      return { authenticated: false };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } finally {
      localStorage.removeItem('albright_admin_token');
    }
  },

  // Admin Protected
  async getAdminStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load admin stats');
    return res.json();
  },

  async getStats(): Promise<DashboardStats> {
    return this.getAdminStats();
  },

  async getAdminApplications(params?: {
    status?: string;
    grade?: string;
    search?: string;
  }): Promise<AdmissionApplication[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.grade && params.grade !== 'All') query.set('grade', params.grade);
    if (params?.search) query.set('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/admin/applications${qs}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load applications');
    return res.json();
  },

  async getApplications(params?: {
    status?: string;
    grade?: string;
    search?: string;
  }): Promise<AdmissionApplication[]> {
    return this.getAdminApplications(params);
  },

  async updateApplicationStatus(id: string, status: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/applications/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update application status');
    return json;
  },

  async deleteApplication(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete application');
  },

  // Admin News
  async getAdminNews(): Promise<NewsItem[]> {
    const res = await fetch(`${API_BASE}/admin/news`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load news');
    return res.json();
  },

  async createNews(data: Partial<NewsItem>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/news`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create news');
    return json;
  },

  async updateNews(id: string, data: Partial<NewsItem>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/news/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update news');
    return json;
  },

  async deleteNews(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete news');
  },

  // Admin Events
  async createEvent(data: Partial<SchoolEvent>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create event');
    return json;
  },

  async updateEvent(id: string, data: Partial<SchoolEvent>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update event');
    return json;
  },

  async deleteEvent(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete event');
  },

  // Admin Gallery
  async addGalleryImage(data: {
    title: string;
    description?: string;
    imageUrl: string;
    category: GalleryCategory;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to add gallery image');
    return json;
  },

  async createGalleryImage(data: {
    title: string;
    description?: string;
    imageUrl: string;
    category: GalleryCategory;
  }): Promise<any> {
    return this.addGalleryImage(data);
  },

  async deleteGalleryImage(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete gallery image');
  },

  // Admin Messages
  async getAdminMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/admin/messages`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load messages');
    return res.json();
  },

  async getMessages(): Promise<ContactMessage[]> {
    return this.getAdminMessages();
  },

  async toggleMessageRead(id: string, isRead: boolean): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isRead }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update message');
    return json;
  },

  async updateMessageStatus(id: string, status: 'Read' | 'Unread'): Promise<any> {
    return this.toggleMessageRead(id, status === 'Read');
  },

  async deleteMessage(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete message');
  },

  // Admin Settings
  async updateSettings(settings: Partial<SchoolSettings>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update settings');
    return json;
  },
};
