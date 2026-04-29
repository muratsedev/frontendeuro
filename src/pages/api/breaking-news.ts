import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

export type BreakingNews = {
    id: number;
    title: string;
    breakingNewsDuration: string;
    createdAt: string;
    isPublished: boolean;
};

type BreakingNewsRaw = BreakingNews & {
    Id?: number;
    Title?: string;
    BreakingNewsDuration?: string;
    CreatedAt?: string;
    IsPublished?: boolean;
};

// Backend API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';
const BREAKING_NEWS_API_URL = `${BASE_URL}/api/BreakingNews`;

// Configure axios to handle HTTPS development certificates
const axiosInstance = axios.create({
    timeout: 30000, // Increased timeout to 30 seconds
    httpsAgent: process.env.NODE_ENV === 'development' ? 
        new https.Agent({ rejectUnauthorized: false }) : undefined
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log('Breaking News API - Fetching from:', BREAKING_NEWS_API_URL);

        const response = await axiosInstance.get<BreakingNewsRaw[]>(BREAKING_NEWS_API_URL);
        const allNews = (response.data || []).map((item) => ({
            id: item.id ?? item.Id ?? 0,
            title: item.title ?? item.Title ?? '',
            breakingNewsDuration: item.breakingNewsDuration ?? item.BreakingNewsDuration ?? '00:00:00',
            createdAt: item.createdAt ?? item.CreatedAt ?? new Date(0).toISOString(),
            isPublished: Boolean(item.isPublished ?? item.IsPublished ?? false)
        }));

        const breakingNews = allNews
            .filter(news => news.isPublished)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log('Breaking News API - Final items count:', breakingNews.length);

        res.status(200).json(breakingNews);
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.response?.data);
            console.error('Axios error status:', error.response?.status);
            console.error('Axios error URL:', error.config?.url);
        }
        res.status(500).json({ error: 'Failed to fetch breaking news' });
    }
}