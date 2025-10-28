export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY: '/auth/verify',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    SET_PASSWORD: '/auth/set-password',
    ME: '/me',
  },

  // Cuenta de usuario
  ACCOUNT: {
    PROFILE: '/api/account',
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/api/chat/conversations',
    CONVERSATION: (id: string) => `/api/chat/conversations/${id}`,
    MESSAGES: (id: string) => `/api/chat/conversations/${id}/messages`,
    MESSAGE_FEEDBACK: (id: string) => `/api/chat/messages/${id}/feedback`,
  },

  // Admin
  ADMIN: {
    USERS: '/api/admin/users',
    GRANT_ADMIN: (id: string) => `/api/admin/users/${id}/grant-admin`,
    REVOKE_ADMIN: (id: string) => `/api/admin/users/${id}/revoke-admin`,
    CONVERSATIONS: '/api/admin/chat/conversations',
    CONVERSATION: (id: string) => `/api/admin/chat/conversations/${id}`,
    FEEDBACK_SUMMARY: '/api/admin/chat/feedback/summary',
    FEEDBACK_MESSAGES: '/api/admin/chat/feedback/messages',
  },
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify',
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  PROFILE: '/profile',
  ADMIN: '/admin',
} as const

export const LOCAL_STORAGE_KEYS = {
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_DISPLAY_NAME_LENGTH: 50,
  MAX_MESSAGE_LENGTH: 2000,
} as const

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  MICROSOFT: 'microsoft',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const
