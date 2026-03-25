import type { User } from '../types/userType';

/**
 * Normalise la réponse login/register quand le backend utilise un cookie HTTP-only
 * (pas de JWT côté client). Formats acceptés :
 * - `{ user: User }`
 * - `User` à la racine
 * - Ancien format `{ access_token, ...user }` (rétrocompatibilité)
 */
export function userFromAuthResponse(data: unknown): User {
  if (!data || typeof data !== 'object') {
    throw new Error('Réponse serveur invalide');
  }
  const d = data as Record<string, unknown>;

  if (d.user && typeof d.user === 'object' && d.user !== null) {
    return d.user as User;
  }

  if ('access_token' in d) {
    const { access_token: _token, ...rest } = d;
    if ('id' in rest && 'email' in rest) {
      return rest as unknown as User;
    }
  }

  if ('id' in d && 'email' in d) {
    return d as unknown as User;
  }

  throw new Error('Réponse serveur invalide');
}
