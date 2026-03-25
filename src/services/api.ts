import axios from 'axios';

/**
 * `withCredentials: true` envoie les cookies HTTP-only (session) à chaque requête
 * vers l’API (même origine ou CORS correctement configuré côté backend).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
