import './globals.css';
import Link from 'next/link';

export const metadata = {
  metadataBase: new URL('https://blog.marzan.info'),
  title: { default: 'Marzan — Notes & Projects', template: '%s — Marzan' },
  description: 'A personal journal about projects, photographs, places, learning and whatever feels worth writing down.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en">
    <body>
      <header className="site-header">
        <Link className="brand" href="/">marzan</Link>
        <nav aria-label="Primary navigation">
          <Link href="/categories">Categories</Link>
          <Link href="/now">Now</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <span className="footer-mark">blog.marzan.info</span>
        <span>Notes, photographs &amp; work in progress · © 2026</span>
      </footer>
    </body>
  </html>;
}
