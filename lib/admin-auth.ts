import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'marzan_blog_admin';

function hmac(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return '';
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function createAdminSession() {
  return hmac('marzan-blog-admin');
}

export function isAdminSession(value?: string) {
  if (!value) return false;
  const expected = createAdminSession();
  if (!expected || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function verifyAdminPassword(value: string) {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  if (!expected || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
