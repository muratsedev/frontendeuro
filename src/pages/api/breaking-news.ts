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

// Backend API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com';
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

        const response = await axiosInstance.get<BreakingNews[]>(BREAKING_NEWS_API_URL);
        const breakingNews = response.data;

        console.log('Breaking News API - Received items:', breakingNews.length);

        // Filter only published breaking news
        const publishedNews = breakingNews.filter(news => news.isPublished);

        // Sort by createdAt (newest first)
        publishedNews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log('Breaking News API - Final items count:', publishedNews.length);

        // Debug: Log first few titles
        if (publishedNews.length > 0) {
            console.log('Breaking News API - Sample titles:', publishedNews.slice(0, 3).map(n => n.title));
        }

        res.status(200).json(publishedNews);
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