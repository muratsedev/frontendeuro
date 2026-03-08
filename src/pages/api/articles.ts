import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

export type Article = {
    id: string;
    articleTitle: string;
    articleSummary: string;
    articleContent: string;
    imagePath: string;
    createdDate: string;
    updatedDate: string;
    isPublished: boolean;
    categoryId: number;
};

// Backend API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';
const ARTICLES_API_URL = `${BASE_URL}/api/Articles`;

// Configure axios to handle HTTPS development certificates
const axiosInstance = axios.create({
    timeout: 30000, // Increased timeout to 30 seconds
    httpsAgent: process.env.NODE_ENV === 'development' ? 
        new https.Agent({ rejectUnauthorized: false }) : undefined
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { categoryId, excludeId } = req.query;

    console.log('Articles API - categoryId:', categoryId);
    console.log('Articles API - excludeId:', excludeId);

    try {
        let apiUrl = ARTICLES_API_URL;
        
        // If categoryId is provided, fetch articles for that category
        if (categoryId) {
            apiUrl = `${ARTICLES_API_URL}/Category/${categoryId}`;
        }

        console.log('Articles API - Fetching from:', apiUrl);

        const response = await axiosInstance.get<Article[]>(apiUrl);
        const articles = response.data;

        console.log('Articles API - Received articles:', articles.length);

        // Filter only published articles
        let publishedArticles = articles.filter(article => article.isPublished);

        // Sort by createdDate (newest first)
        publishedArticles.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

        // Exclude specific article if requested
        if (excludeId) {
            publishedArticles = publishedArticles.filter(article => article.id !== excludeId);
        }

        console.log('Articles API - Final articles count:', publishedArticles.length);

        // Debug: Log first few article titles
        if (publishedArticles.length > 0) {
            console.log('Articles API - Sample articles:', publishedArticles.slice(0, 3).map(a => a.articleTitle));
        }

        res.status(200).json(publishedArticles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.response?.data);
            console.error('Axios error status:', error.response?.status);
            console.error('Axios error URL:', error.config?.url);
        }
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
}
