import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

// Backend API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com';
const BREAKING_NEWS_API_URL = `${BASE_URL}/api/BreakingNews`;

// Configure axios to handle HTTPS development certificates
const axiosInstance = axios.create({
    timeout: 10000,
    httpsAgent: process.env.NODE_ENV === 'development' ? 
        new https.Agent({ rejectUnauthorized: false }) : undefined
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid breaking news ID' });
    }

    if (req.method === 'PUT') {
        try {
            const { isPublished, title, breakingNewsDuration } = req.body;
            
            console.log(`Updating breaking news ${id} with data:`, req.body);

            const updateData: {
                isPublished?: boolean;
                title?: string;
                breakingNewsDuration?: string;
            } = {};
            
            if (typeof isPublished === 'boolean') {
                updateData.isPublished = isPublished;
            }
            if (title) {
                updateData.title = title;
            }
            if (breakingNewsDuration) {
                updateData.breakingNewsDuration = breakingNewsDuration;
            }

            await axiosInstance.put(
                `${BREAKING_NEWS_API_URL}/${id}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`Breaking news ${id} updated successfully`);
            res.status(200).json({ message: 'Breaking news updated successfully' });
        } catch (error) {
            console.error(`Error updating breaking news ${id}:`, error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', error.response?.data);
                console.error('Axios error status:', error.response?.status);
                const status = error.response?.status || 500;
                res.status(status).json({ 
                    error: 'Failed to update breaking news',
                    details: error.response?.data 
                });
            } else {
                res.status(500).json({ error: 'Failed to update breaking news' });
            }
        }
    } else if (req.method === 'GET') {
        try {
            console.log(`Fetching breaking news ${id}`);
            
            const response = await axiosInstance.get(`${BREAKING_NEWS_API_URL}/${id}`);
            const breakingNews = response.data;

            console.log(`Breaking news ${id} fetched successfully`);
            res.status(200).json(breakingNews);
        } catch (error) {
            console.error(`Error fetching breaking news ${id}:`, error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', error.response?.data);
                console.error('Axios error status:', error.response?.status);
                const status = error.response?.status || 500;
                res.status(status).json({ 
                    error: 'Failed to fetch breaking news',
                    details: error.response?.data 
                });
            } else {
                res.status(500).json({ error: 'Failed to fetch breaking news' });
            }
        }
    } else if (req.method === 'DELETE') {
        try {
            console.log(`Deleting breaking news ${id}`);
            
            await axiosInstance.delete(`${BREAKING_NEWS_API_URL}/${id}`);

            console.log(`Breaking news ${id} deleted successfully`);
            res.status(200).json({ message: 'Breaking news deleted successfully' });
        } catch (error) {
            console.error(`Error deleting breaking news ${id}:`, error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', error.response?.data);
                console.error('Axios error status:', error.response?.status);
                const status = error.response?.status || 500;
                res.status(status).json({ 
                    error: 'Failed to delete breaking news',
                    details: error.response?.data 
                });
            } else {
                res.status(500).json({ error: 'Failed to delete breaking news' });
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}