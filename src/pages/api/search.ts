import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

type Article = {
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
    timeout: 30000,
    httpsAgent: process.env.NODE_ENV === 'development' ? 
        new https.Agent({ rejectUnauthorized: false }) : undefined,
    maxRedirects: 3,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query, sortBy = 'createdDate', order = 'desc', limit = 20 } = req.query;

    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        console.log(`Searching articles for query: "${query}"`);
        
        // Fetch all articles from backend
        const response = await axiosInstance.get<Article[]>(ARTICLES_API_URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'NextJS-Frontend/1.0',
            },
        });

        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response format from backend');
        }

        const articles = response.data;
        console.log(`Fetched ${articles.length} articles from backend`);

        // Filter articles based on search query (case-insensitive)
        const searchTerm = query.toLowerCase().trim();
        const filteredArticles = articles.filter(article => 
            article.isPublished && (
                article.articleTitle.toLowerCase().includes(searchTerm) ||
                article.articleSummary.toLowerCase().includes(searchTerm) ||
                article.articleContent.toLowerCase().includes(searchTerm)
            )
        );

        console.log(`Found ${filteredArticles.length} articles matching search query`);

        // Sort articles by specified field and order
        const sortedArticles = filteredArticles.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'createdDate':
                    comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
                    break;
                case 'updatedDate':
                    comparison = new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime();
                    break;
                case 'title':
                    comparison = a.articleTitle.localeCompare(b.articleTitle);
                    break;
                default:
                    comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
            }

            return order === 'desc' ? -comparison : comparison;
        });

        // Limit results
        const limitedResults = sortedArticles.slice(0, parseInt(limit as string));

        console.log(`Returning ${limitedResults.length} sorted articles`);

        res.status(200).json({
            query: query,
            totalResults: filteredArticles.length,
            returnedResults: limitedResults.length,
            sortBy,
            order,
            articles: limitedResults
        });

    } catch (error) {
        console.error('Error searching articles:', error);
        
        let errorMessage = 'Unknown error';
        if (axios.isAxiosError(error)) {
            errorMessage = `Backend API error: ${error.code} - ${error.message}`;
            if (error.response) {
                errorMessage += ` (Status: ${error.response.status})`;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        res.status(500).json({
            error: 'Failed to search articles',
            details: errorMessage,
            query: query
        });
    }
}