import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  const supabase = createClient(
    'https://ibygzkntdaljyduuhivj.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: posts, error } = await supabase
    .from('blogs')
    .select('slug, updated_at');

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Supabase error' });
  }

  const baseUrl = 'https://www.vizepedia.com';
  const staticRoutes = [
    '',
    '/blog',
    '/hakkimizda',
    '/dashboard',
    '/ready-documents',
    '/planned-documents',
    '/withus-documents',
    '/cerez-politikasi',
    '/kisisel-verilerin-korunmasi',
    '/davetiye-olustur',
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const pathItem of staticRoutes) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}${pathItem}</loc>\n`;
    sitemap += `    <priority>0.6</priority>\n`;
    sitemap += `  </url>\n`;
  }

  for (const post of posts) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    sitemap += `    <lastmod>${dayjs(post.updated_at).format('YYYY-MM-DD')}</lastmod>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;
  }

  sitemap += `</urlset>\n`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}
