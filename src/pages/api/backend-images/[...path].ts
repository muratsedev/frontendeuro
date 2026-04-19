import type { NextApiRequest, NextApiResponse } from 'next';

const PRIMARY_BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';
const LEGACY_BACKEND = 'https://euronews-001-site2.stempurl.com';
const PLACEHOLDER_PATH = '/img/1.jpg';
const SOCIAL_PLACEHOLDER_PATH = '/globe.svg';

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, '');

const buildCandidateUrls = (joinedPath: string): string[] => {
  const normalizedPath = joinedPath.replace(/^\/+/, '');
  const primary = `${normalizeBaseUrl(PRIMARY_BACKEND)}/${normalizedPath}`;

  // For uploads paths, try legacy host as compatibility fallback.
  if (normalizedPath.startsWith('uploads/')) {
    const legacy = `${normalizeBaseUrl(LEGACY_BACKEND)}/${normalizedPath}`;
    return [primary, legacy];
  }

  return [primary];
};

const proxyImage = async (targetUrl: string): Promise<Response | null> => {
  try {
    const response = await fetch(targetUrl);
    return response.ok ? response : null;
  } catch {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const pathSegments = req.query.path;
  const joinedPath = Array.isArray(pathSegments) ? pathSegments.join('/') : String(pathSegments || '');
  const normalizedJoinedPath = joinedPath.replace(/^\/+/, '');
  const fallbackPath = normalizedJoinedPath.startsWith('uploads/sm/') ? SOCIAL_PLACEHOLDER_PATH : PLACEHOLDER_PATH;

  if (!joinedPath) {
    res.redirect(307, fallbackPath);
    return;
  }

  const candidates = buildCandidateUrls(joinedPath);

  for (const candidate of candidates) {
    const response = await proxyImage(candidate);
    if (!response) {
      continue;
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const cacheControl = response.headers.get('cache-control') || 'public, max-age=300';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', cacheControl);
    res.status(200).send(Buffer.from(arrayBuffer));
    return;
  }

  res.redirect(307, fallbackPath);
}
