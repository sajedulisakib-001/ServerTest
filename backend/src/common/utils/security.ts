import * as crypto from 'crypto';

let _cachedSecret: string | null = null;

/**
 * Returns the cryptographically secure JWT secret from process.env,
 * or synthesizes a dynamic high-entropy session secret if omitted.
 */
export function getJwtSecret(): string {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 16) {
    return process.env.JWT_SECRET.trim();
  }

  if (!_cachedSecret) {
    _cachedSecret = crypto.randomBytes(32).toString('hex');
    console.warn(
      '[SECURITY NOTICE] JWT_SECRET was not provided in environment variables. A high-entropy session secret has been generated automatically.',
    );
  }

  return _cachedSecret;
}
