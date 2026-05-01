import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

export type CategoryWithArticles = {
    id: number;
    name: string;
    categorySlug: string;
    isActivated: boolean;
    articles: Article[];
};

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
    tagId?: number | null;
    tagName?: string | null;
};

// Backend API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';

// Configure axios to handle HTTPS development certificates
const axiosInstance = axios.create({
    timeout: 30000, // Increased timeout to 30 seconds
    httpsAgent: process.env.NODE_ENV === 'development' ? 
        new https.Agent({ rejectUnauthorized: false }) : undefined
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { categoryId, excludeId } = req.query;

    console.log('Categories with articles API - categoryId:', categoryId);
    console.log('Categories with articles API - excludeId:', excludeId);

    try {
        let apiUrl: string;
        
        if (categoryId) {
            // Use the specific category with articles endpoint
            apiUrl = `${BASE_URL}/api/Categories/${categoryId}/with-articles`;
            console.log('Categories with articles API - Fetching single category from:', apiUrl);
            
            const response = await axiosInstance.get<CategoryWithArticles>(apiUrl);
            const categoryData = response.data;

            console.log('Categories with articles API - Received category:', categoryData.name);
            console.log('Categories with articles API - Articles in category:', categoryData.articles?.length || 0);

            // Filter only published articles and sort by createdDate (newest first)
            let publishedArticles = categoryData.articles?.filter(article => article.isPublished) || [];
            publishedArticles.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
            
            // Exclude specific article if requested
            if (excludeId) {
                publishedArticles = publishedArticles.filter(article => article.id !== excludeId);
            }
            
            console.log('Categories with articles API - Final articles count:', publishedArticles.length);
            res.status(200).json(publishedArticles);
        } else {
            // Use the all categories with articles endpoint
            apiUrl = `${BASE_URL}/api/Categories/with-articles`;
            console.log('Categories with articles API - Fetching all categories from:', apiUrl);
            
            const response = await axiosInstance.get<CategoryWithArticles[]>(apiUrl);
            const categoriesWithArticles = response.data;

            console.log('Categories with articles API - Received categories:', categoriesWithArticles.length);

            // Return all categories with their published articles sorted by createdDate (newest first)
            const categoriesWithPublishedArticles = categoriesWithArticles.map(category => {
                const publishedArticles = category.articles?.filter(article => article.isPublished) || [];
                publishedArticles.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
                return {
                    ...category,
                    articles: publishedArticles
                };
            });
            res.status(200).json(categoriesWithPublishedArticles);
        }
    } catch (error) {
        console.error('Error fetching categories with articles:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.response?.data);
            console.error('Axios error status:', error.response?.status);
        }
        res.status(500).json({ error: 'Failed to fetch categories with articles' });
    }
}
