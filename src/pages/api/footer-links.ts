import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

type CategoryResponse = {
    id: number;
    name: string;
    categorySlug: string;
    isActivated: boolean;
    isShowInFooter?: boolean;
};

type FooterLink = {
    id: number;
    name: string;
    categorySlug: string;
    isActivated: boolean;
    href: string;
    isShowInFooter: boolean;
};

// Backend API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';
const CATEGORIES_API_URL = `${BASE_URL}/api/Categories`;

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

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`=== Footer Links API Handler Started (Attempt ${attempt}/${maxRetries}) ===`);
            console.log('Categories API URL:', CATEGORIES_API_URL);
            
            const response = await axiosInstance.get<CategoryResponse[]>(CATEGORIES_API_URL, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'NextJS-Frontend/1.0',
                },
            });
            
            console.log('Backend response status:', response.status);

            if (!response.data || !Array.isArray(response.data)) {
                console.error('Invalid response format - not an array:', response.data);
                throw new Error('Invalid response format from backend - expected array');
            }

            const categories = response.data;
            console.log('Categories received for footer:', categories.length);

            // Filter categories for footer: only show activated categories with isShowInFooter = true
            const footerLinks: FooterLink[] = categories
                .filter((category: CategoryResponse) => {
                    const showInFooter = category.isShowInFooter ?? false;
                    console.log(`Footer - Category ${category.name} (${category.categorySlug}) - activated: ${category.isActivated} - showInFooter: ${showInFooter}`);
                    return category.isActivated && showInFooter;
                })
                .map((category: CategoryResponse) => ({
                    id: category.id,
                    name: category.name,
                    categorySlug: category.categorySlug,
                    isActivated: category.isActivated,
                    href: `/${category.categorySlug}`,
                    isShowInFooter: true
                } as FooterLink));

            console.log('Footer links count:', footerLinks.length);
            console.log('Footer links:', footerLinks.map(l => ({ id: l.id, name: l.name, href: l.href })));
            
            res.status(200).json(footerLinks);
            return;
            
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`Attempt ${attempt} failed:`, error);
            
            if (axios.isAxiosError(error) && error.code === 'ECONNABORTED' && attempt < maxRetries) {
                console.log(`Timeout occurred, retrying in 2 seconds... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
            }
            
            break;
        }
    }

    // All attempts failed
    console.error('All attempts failed for footer links');
    
    let errorMessage = 'Unknown error';
    if (axios.isAxiosError(lastError)) {
        errorMessage = `Backend API error: ${lastError.code} - ${lastError.message}`;
        if (lastError.response) {
            errorMessage += ` (Status: ${lastError.response.status})`;
        }
    } else if (lastError instanceof Error) {
        errorMessage = lastError.message;
    }
    
    console.error('Final error details:', errorMessage);
    
    // Return empty array on error (footer can be empty if backend is down)
    res.status(200).json([]);
}
