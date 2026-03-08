import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

// Backend API configuration — server-side only, not exposed to client bundle
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';
const SOCIAL_MEDIA_API_URL = `${BASE_URL}/api/SocialMedia`;

const axiosInstance = axios.create({
    timeout: 10000,
    httpsAgent: process.env.NODE_ENV === 'development'
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await axiosInstance.get(SOCIAL_MEDIA_API_URL);
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching social media:', error);
        res.status(500).json({ error: 'Failed to fetch social media' });
    }
}
