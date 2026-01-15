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
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com';
const ARTICLES_API_URL = `${BASE_URL}/api/Articles`;

// Configure axios to handle HTTPS development certificates
const axiosInstance = axios.create({
    timeout: 10000,
    httpsAgent: process.env.NODE_ENV === 'development' ? 
        new https.Agent({ rejectUnauthorized: false }) : undefined
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Article ID is required' });
    }

    try {
        const response = await axiosInstance.get<Article>(`${ARTICLES_API_URL}/${id}`);
        const article = response.data;

        if (!article.isPublished) {
            return res.status(404).json({ error: 'Article not found or not published' });
        }

        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            res.status(404).json({ error: 'Article not found' });
        } else {
            res.status(500).json({ error: 'Failed to fetch article' });
        }
    }
}
