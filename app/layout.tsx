import './globals.css';
import Link from 'next/link';

export const metadata = {
  metadataBase: new URL('https://blog.marzan.info'),
  title: { default: 'Marzan', template: '%s — Marzan' },
  description: 'A personal journal of photographs, projects, places and notes.',
  alternates: { types: { 'application/rss+xml': '/rss.xml' } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en">
    <body>
      <header className="site-header">
        <Link className="brand" href="/">Marzan</Link>
        <nav aria-label="Primary navigation">
          <Link href="/categories">Categories</Link>
          <Link href="/now">Now</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <span>© 2026 Marzan</span>
        <Link href="/rss.xml">RSS</Link>
      </footer>
    </body>
  </html>;
}
