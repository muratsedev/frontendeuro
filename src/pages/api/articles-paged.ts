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
    categoryName?: string;
    categorySlug?: string;
    tagId?: number;
    tagName?: string;
    editorChoice?: boolean;
    upperArticleId?: number;
    upperArticleName?: string;
};

export type PagedResult = {
    items: Article[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';

const axiosInstance = axios.create({
    timeout: 30000,
    httpsAgent: process.env.NODE_ENV === 'development'
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { page = '1', pageSize = '10', categoryId } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 10));

    const params = new URLSearchParams({
        page: pageNum.toString(),
        pageSize: pageSizeNum.toString(),
    });

    if (categoryId) {
        params.append('categoryId', categoryId as string);
    }

    try {
        const response = await axiosInstance.get<PagedResult>(
            `${BASE_URL}/api/Articles/paged?${params.toString()}`
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching paged articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
}
