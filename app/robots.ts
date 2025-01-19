import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/bot']
    },
    sitemap: ['https://www.questraven.ai/sitemap.xml']
  };
}
