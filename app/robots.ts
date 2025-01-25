import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/raven']
    },
    sitemap: ['https://www.questraven.ai/sitemap.xml']
  };
}
