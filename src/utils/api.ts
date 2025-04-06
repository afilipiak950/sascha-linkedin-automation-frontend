import axios from 'axios';

// API-Basis-URL aus den Umgebungsvariablen
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Hilfsfunktion um zu prüfen, ob wir im Browser sind
const isBrowser = typeof window !== 'undefined';

// Funktion zum sicheren Zugriff auf localStorage
const getStoredToken = () => {
  if (isBrowser) {
    return localStorage.getItem('token');
  }
  return null;
};

const setStoredToken = (token: string) => {
  if (isBrowser) {
    localStorage.setItem('token', token);
  }
};

const removeStoredToken = () => {
  if (isBrowser) {
    localStorage.removeItem('token');
  }
};

// Axios-Instance mit Basis-Konfiguration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request-Interceptor für Auth-Token
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response-Interceptor für Fehlerbehandlung
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token ist abgelaufen oder ungültig
      removeStoredToken();
      if (isBrowser) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API-Funktionen für LinkedIn-Automatisierung
export const linkedinApi = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
      setStoredToken(response.data.token);
    }
    return response.data;
  },

  logout: () => {
    removeStoredToken();
  },

  // Post-Management
  generatePost: async (topic: string, style: string, length: string) => {
    const response = await api.post('/api/posts/generate', { topic, style, length });
    return response.data;
  },

  schedulePost: async (content: string, scheduledTime: Date) => {
    const response = await api.post('/api/posts/schedule', { content, scheduledTime });
    return response.data;
  },

  // Interaktionen
  likePost: async (postId: string) => {
    const response = await api.post(`/api/interactions/like/${postId}`);
    return response.data;
  },

  commentOnPost: async (postId: string, comment: string) => {
    const response = await api.post(`/api/interactions/comment/${postId}`, { comment });
    return response.data;
  },

  // Netzwerk-Management
  searchProspects: async (keywords: string[], industries: string[]) => {
    const response = await api.post('/api/network/search', { keywords, industries });
    return response.data;
  },

  sendConnectionRequest: async (profileId: string, message: string) => {
    const response = await api.post('/api/network/connect', { profileId, message });
    return response.data;
  },

  // Automatisierungs-Einstellungen
  getSettings: async () => {
    const response = await api.get('/api/settings');
    return response.data;
  },

  updateSettings: async (settings: any) => {
    const response = await api.put('/api/settings', settings);
    return response.data;
  },
};

export default api; 