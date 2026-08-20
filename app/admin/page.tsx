import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AdminWriter from './AdminWriter';
import { ADMIN_COOKIE, isAdminSession } from '../../lib/admin-auth';

export const metadata: Metadata = {
  title: 'Writer',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authenticated = isAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);

  if (!authenticated) {
    return <section style={{maxWidth:480,margin:'8vh auto'}}>
      <div className="kicker">Private</div>
      <h1 className="page-title">Writer.</h1>
      <p className="page-intro">Sign in to write and publish to blog.marzan.info.</p>
      <form action="/api/admin/login" method="post" style={{display:'grid',gap:12}}>
        <label htmlFor="password" className="meta">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required style={{font:'inherit',padding:'13px 14px',border:'1px solid var(--line)',background:'var(--surface)',color:'var(--fg)'}} />
        <button type="submit" style={{font:'inherit',padding:'13px 16px',border:0,background:'var(--fg)',color:'var(--bg)',cursor:'pointer'}}>Enter writer</button>
      </form>
    </section>;
  }

  return <AdminWriter />;
}
