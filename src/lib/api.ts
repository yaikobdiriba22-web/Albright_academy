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

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  id: 'default',
  schoolName: 'Albright Academy',
  slogan: 'Center of Excellence and Innovation',
  logoUrl: '/logo.png',
  phone: '0923014132',
  email: 'dinigaatrading@gmail.com',
  address: 'Sheggar city, Gefarsa Gujjee, kella',
  mapsUrl: 'https://maps.google.com/?q=Sheggar+city+Gefarsa+Gujjee+kella',
  latitude: 9.0685,
  longitude: 38.6521,
  facebookUrl: 'https://facebook.com/albrightacademy',
  telegramUrl: 'https://t.me/albrightacademy',
  youtubeUrl: 'https://youtube.com/@albrightacademy',
  mission:
    'To foster an inspiring, technology-forward, and compassionate educational environment where every student from KG1 to Grade 8 develops critical thinking, strong character, innovative problem-solving, and a genuine passion for lifelong learning.',
  vision:
    'To be the premier school of excellence and innovation in East Africa, graduating confident, ethical, and forward-looking leaders equipped for an ever-changing world.',
  about:
    'Albright Academy is a distinguished independent day school serving young scholars from Kindergarten (KG1) through Junior Secondary (Grade 8). Founded on principles of academic rigor, technological empowerment, and holistic character formation, Albright Academy bridges contemporary educational pedagogy with hands-on experiential learning.',
  principalName: 'Mr. Tola Name',
  principalRole: 'Principal & Head of School',
  principalMessage:
    'Welcome to Albright Academy! At Albright, every child is recognized as an inquisitive thinker and a future innovator. Our goal is to cultivate a secure, vibrant community where students feel cherished, encouraged to ask probing questions, and empowered to discover their distinct gifts. Together with dedicated educators and engaged parents, we prepare our scholars not just for secondary school, but for meaningful lives of impact.',
  principalPhotoUrl:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  tickerEnabled: true,
  tickerText: 'Albright Academy — Center of Excellence and Innovation',
  tickerBadge: 'Created by Admin',
  tickerSubtext: 'Center of Excellence and Innovation • KG1 to Grade 8',
  tickerSecondaryText: 'Admissions Open 2026/2018 E.C. — Sheggar City, Gefarsa Gujjee, kella',
  tickerSpeed: 'normal',
  tickerCreatedBy: 'Admin',
  tickerUpdatedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Annual STEM & Innovation Fair 2026 Announced',
    slug: 'annual-stem-and-innovation-fair-2026',
    summary:
      'Students from Kindergarten to Grade 8 will showcase interactive robotics, sustainable science experiments, and computational design projects.',
    content:
      "Albright Academy is delighted to announce our flagship Annual STEM & Innovation Exhibition. Parents, community mentors, and technology leaders are cordially invited to witness our young innovators demonstrating that tomorrow's breakthroughs begin with curiosity in today's classrooms.\n\nEvent highlights include:\n• Junior Coding & Micro-controller demonstrations by Grades 5-8\n• Hands-on chemical and botanical discoveries by Grades 1-4\n• Creative sensorial engineering displays by KG scholars",
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    author: 'Department of Science & Innovation',
    status: 'Published',
    publishedAt: '2026-03-12T08:00:00.000Z',
    createdAt: '2026-03-12T08:00:00.000Z',
    updatedAt: '2026-03-12T08:00:00.000Z',
  },
  {
    id: 'news-2',
    title: 'Inauguration of the Modernised Junior Library & Media Hub',
    slug: 'inauguration-modernised-junior-library-media-hub',
    summary:
      'With over 5,000 curated books, interactive digital reading terminals, and quiet study alcoves, our learning resource centre takes a major leap forward.',
    content:
      'Reading opens the gates to empathy and boundless imagination. Albright Academy has officially opened its revamped Media & Reading Sanctuary, equipped with ergonomic reading spaces, age-appropriate encyclopedias, bilingual African and international literature, and guided digital research stations.\n\nEvery class has designated weekly library discovery hours supervised by certified literacy coaches.',
    imageUrl:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
    author: 'Head of Academics',
    status: 'Published',
    publishedAt: '2026-02-28T10:30:00.000Z',
    createdAt: '2026-02-28T10:30:00.000Z',
    updatedAt: '2026-02-28T10:30:00.000Z',
  },
  {
    id: 'news-3',
    title: 'Kindergarten Cultural Discovery Day Brings Joy and Unity',
    slug: 'kindergarten-cultural-discovery-day',
    summary:
      'Our youngest learners from KG1 to KG3 celebrated cultural heritage through traditional music, colorful attire, storytelling, and culinary exploration.',
    content:
      'Nurturing mutual respect and cultural appreciation starts in early childhood. Our KG scholars brought our central amphitheatre alive with radiant colors, regional songs, and joyful dance performances alongside their teachers and families.',
    imageUrl:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    author: 'Early Childhood Coordinator',
    status: 'Published',
    publishedAt: '2026-02-15T09:00:00.000Z',
    createdAt: '2026-02-15T09:00:00.000Z',
    updatedAt: '2026-02-15T09:00:00.000Z',
  },
];

const FALLBACK_EVENTS: SchoolEvent[] = [
  {
    id: 'event-1',
    title: 'Term 2 Parent-Teacher Academic Progress Conference',
    slug: 'term-2-parent-teacher-conference',
    description:
      'One-on-one personalized consultations between homeroom educators, subject teachers, and parents to review midterm growth, portfolio assessments, and holistic child development.',
    date: '2026-04-10',
    startTime: '08:30 AM',
    endTime: '04:00 PM',
    location: 'Main Academic Pavilion & Homeroom Classrooms',
    imageUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    status: 'Upcoming',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'event-2',
    title: 'Inter-House Track & Athletics Championship 2026',
    slug: 'inter-house-athletics-championship-2026',
    description:
      'A spirited celebration of sportsmanship, endurance, agility, and team camaraderie featuring relay races, long jump, tug-of-war, and sprint finals across all grade levels.',
    date: '2026-04-24',
    startTime: '09:00 AM',
    endTime: '03:30 PM',
    location: 'Albright Academy Sports Complex & Running Field',
    imageUrl:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
    status: 'Upcoming',
    createdAt: '2026-03-03T11:00:00.000Z',
    updatedAt: '2026-03-03T11:00:00.000Z',
  },
  {
    id: 'event-3',
    title: 'Albright Creative Arts & Music Evening',
    slug: 'creative-arts-and-music-evening',
    description:
      'An enchanting twilight gala displaying student artwork, pottery, piano recitals, and the Albright Junior Choir performing classical and contemporary melodies.',
    date: '2026-05-15',
    startTime: '05:00 PM',
    endTime: '07:30 PM',
    location: 'School Auditorium & Fine Arts Terrace',
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    status: 'Upcoming',
    createdAt: '2026-03-08T12:00:00.000Z',
    updatedAt: '2026-03-08T12:00:00.000Z',
  },
];

const FALLBACK_GALLERY: GalleryImage[] = [
  {
    id: 'gal-1',
    title: 'Modern Science & Exploration Lab',
    description: 'Grade 6 scholars conducting collaborative chemistry and microscope observations.',
    imageUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    category: 'Classrooms',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Kindergarten Joyful Play-Based Learning',
    description: 'KG2 students engaged in fine motor and creative building block exercises.',
    imageUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
    category: 'Students',
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 'gal-3',
    title: 'Albright Campus Green Courtyard',
    description: 'Safe, gated, tree-lined open grounds promoting fresh air and active recreation.',
    imageUrl:
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    category: 'School',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'gal-4',
    title: 'Junior Robotics and Coding Club',
    description: 'Building critical algorithmic thinking through block coding and sensor kits.',
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    category: 'Activities',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z',
  },
];

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('albright_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Robust JSON fetch helper that safely parses responses and catches non-JSON HTML error pages
 * preventing "Unexpected token < or T ... is not valid JSON" crashes.
 */
async function safeFetchJson<T>(
  url: string,
  options?: RequestInit,
  fallbackError = 'Request failed'
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (netErr: any) {
    throw new Error(netErr?.message || 'Network connection failed');
  }

  const rawText = await res.text();
  let json: any = null;

  if (rawText && rawText.trim().length > 0) {
    try {
      json = JSON.parse(rawText);
    } catch {
      // Non-JSON response (e.g. HTML 502/404/500 proxy error or text message)
      const cleanSnippet = rawText.replace(/<[^>]+>/g, '').trim().slice(0, 120);
      if (!res.ok) {
        throw new Error(cleanSnippet || `${fallbackError} (Status ${res.status})`);
      }
      throw new Error(fallbackError);
    }
  }

  if (!res.ok) {
    const message = json?.error || json?.message || `Server returned error (${res.status})`;
    throw new Error(message);
  }

  return json as T;
}

export const api = {
  // Public Data
  async getSettings(): Promise<SchoolSettings> {
    try {
      return await safeFetchJson<SchoolSettings>(
        `${API_BASE}/settings`,
        undefined,
        'Failed to fetch school settings'
      );
    } catch (err) {
      console.warn('Falling back to default school settings', err);
      return DEFAULT_SCHOOL_SETTINGS;
    }
  },

  async getNews(): Promise<NewsItem[]> {
    try {
      return await safeFetchJson<NewsItem[]>(
        `${API_BASE}/news`,
        undefined,
        'Failed to fetch news'
      );
    } catch (err) {
      console.warn('Falling back to default news', err);
      return FALLBACK_NEWS;
    }
  },

  async getNewsItem(slug: string): Promise<NewsItem> {
    try {
      return await safeFetchJson<NewsItem>(
        `${API_BASE}/news/${slug}`,
        undefined,
        'Failed to fetch article'
      );
    } catch (err) {
      const match = FALLBACK_NEWS.find((n) => n.slug === slug);
      if (match) return match;
      throw err;
    }
  },

  async getEvents(): Promise<SchoolEvent[]> {
    try {
      return await safeFetchJson<SchoolEvent[]>(
        `${API_BASE}/events`,
        undefined,
        'Failed to fetch events'
      );
    } catch (err) {
      console.warn('Falling back to default events', err);
      return FALLBACK_EVENTS;
    }
  },

  async getGallery(category?: GalleryCategory): Promise<GalleryImage[]> {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    try {
      return await safeFetchJson<GalleryImage[]>(
        `${API_BASE}/gallery${query}`,
        undefined,
        'Failed to fetch gallery images'
      );
    } catch (err) {
      console.warn('Falling back to default gallery', err);
      if (category && category !== 'All') {
        return FALLBACK_GALLERY.filter((img) => img.category === category);
      }
      return FALLBACK_GALLERY;
    }
  },

  async submitAdmission(data: Partial<AdmissionApplication>): Promise<{
    message: string;
    referenceNumber: string;
    application: AdmissionApplication;
  }> {
    return safeFetchJson<{
      message: string;
      referenceNumber: string;
      application: AdmissionApplication;
    }>(
      `${API_BASE}/admissions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      'Failed to submit admission application'
    );
  },

  async submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ message: string; id: string }> {
    return safeFetchJson<{ message: string; id: string }>(
      `${API_BASE}/contact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      'Failed to submit contact message'
    );
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const json = await safeFetchJson<{ token: string; user: any }>(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
      'Invalid login credentials'
    );
    if (json.token) {
      localStorage.setItem('albright_admin_token', json.token);
    }
    return json;
  },

  async getMe(): Promise<{ user: any }> {
    return safeFetchJson<{ user: any }>(
      `${API_BASE}/auth/me`,
      { headers: getAuthHeaders() },
      'Not authenticated'
    );
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
    } catch {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('albright_admin_token');
    }
  },

  // Admin Protected
  async getAdminStats(): Promise<DashboardStats> {
    return safeFetchJson<DashboardStats>(
      `${API_BASE}/admin/stats`,
      { headers: getAuthHeaders() },
      'Failed to load admin stats'
    );
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
    return safeFetchJson<AdmissionApplication[]>(
      `${API_BASE}/admin/applications${qs}`,
      { headers: getAuthHeaders() },
      'Failed to load applications'
    );
  },

  async getApplications(params?: {
    status?: string;
    grade?: string;
    search?: string;
  }): Promise<AdmissionApplication[]> {
    return this.getAdminApplications(params);
  },

  async updateApplicationStatus(id: string, status: string): Promise<any> {
    return safeFetchJson<any>(
      `${API_BASE}/admin/applications/${id}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
      'Failed to update application status'
    );
  },

  async deleteApplication(id: string): Promise<void> {
    await safeFetchJson<any>(
      `${API_BASE}/admin/applications/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to delete application'
    );
  },

  // Admin News
  async getAdminNews(): Promise<NewsItem[]> {
    return safeFetchJson<NewsItem[]>(
      `${API_BASE}/admin/news`,
      { headers: getAuthHeaders() },
      'Failed to load news'
    );
  },

  async createNews(data: Partial<NewsItem>): Promise<any> {
    return safeFetchJson<any>(
      `${API_BASE}/admin/news`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to create news'
    );
  },

  async updateNews(id: string, data: Partial<NewsItem>): Promise<any> {
    return safeFetchJson<any>(
      `${API_BASE}/admin/news/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to update news'
    );
  },

  async deleteNews(id: string): Promise<void> {
    await safeFetchJson<any>(
      `${API_BASE}/admin/news/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to delete news'
    );
  },

  // Admin Events
  async createEvent(data: Partial<SchoolEvent>): Promise<any> {
    return safeFetchJson<any>(
      `${API_BASE}/admin/events`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to create event'
    );
  },

  async updateEvent(id: string, data: Partial<SchoolEvent>): Promise<any> {
    return safeFetchJson<any>(
      `${API_BASE}/admin/events/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to update event'
    );
  },

  async deleteEvent(id: string): Promise<void> {
    await safeFetchJson<any>(
      `${API_BASE}/admin/events/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to delete event'
    );
  },

  // Admin Gallery
  async addGalleryImage(data: {
    title: string;
    description?: string;
    imageUrl: string;
    category: GalleryCategory;
  }): Promise<any> {
    return safeFetchJson<any>(
      `${API_BASE}/admin/gallery`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      'Failed to add gallery image'
    );
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
    await safeFetchJson<any>(
      `${API_BASE}/admin/gallery/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to delete gallery image'
    );
  },

  // Admin Messages
  async getAdminMessages(): Promise<ContactMessage[]> {
    return safeFetchJson<ContactMessage[]>(
      `${API_BASE}/admin/messages`,
      { headers: getAuthHeaders() },
      'Failed to load messages'
    );
  },

  async getMessages(): Promise<ContactMessage[]> {
    return this.getAdminMessages();
  },

  async toggleMessageRead(id: string, isRead: boolean): Promise<any> {
    return safeFetchJson<any>(
      `${API_BASE}/admin/messages/${id}/read`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isRead }),
      },
      'Failed to update message'
    );
  },

  async updateMessageStatus(id: string, status: 'Read' | 'Unread'): Promise<any> {
    return this.toggleMessageRead(id, status === 'Read');
  },

  async deleteMessage(id: string): Promise<void> {
    await safeFetchJson<any>(
      `${API_BASE}/admin/messages/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
      'Failed to delete message'
    );
  },

  // Admin Settings
  async updateSettings(settings: Partial<SchoolSettings>): Promise<any> {
    return safeFetchJson<any>(
      `${API_BASE}/admin/settings`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      },
      'Failed to update settings'
    );
  },
};
