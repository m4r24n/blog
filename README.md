# blog.marzan.info

A minimalist personal journal for notes, projects, photography, travel, learning, and occasional updates.

Built with Next.js and designed to deploy on Vercel.

## Publishing a post

1. Create `content/posts/your-post-slug.mdx`.
2. Add frontmatter:

```mdx
---
title: "Post title"
date: "2026-08-20"
category: "Journal"
excerpt: "One short summary for the homepage and social previews."
image: "/images/posts/your-post-slug/cover.jpg" # optional
imageAlt: "Description of the cover photo" # optional
---
```

3. Write normal Markdown/MDX below the frontmatter.
4. Put post photos in `public/images/posts/your-post-slug/` and reference them with paths such as:

```md
![A short useful description](/images/posts/your-post-slug/photo-01.jpg)
```

5. Commit and push. Vercel publishes the change automatically when it reaches the production branch.

The homepage, post routes, category archives, reading time, RSS feed, sitemap, and social metadata are generated from the post files automatically.

## Useful URLs

- RSS: `/rss.xml`
- Sitemap: `/sitemap.xml`
- Categories: `/categories`
