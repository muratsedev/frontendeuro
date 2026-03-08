import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

type NavigationLink = {
    id: number;
    name: string;
    categorySlug: string;
    isActivated: boolean;
    href: string;
    isShowInFooter?: boolean;
};

type CategoryResponse = {
    id: number;
    name: string;
    categorySlug: string;
    isActivated: boolean;
    isShowInFooter?: boolean; // may come as IsShowInFooter from backend
};

// Backend API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';
const CATEGORIES_API_URL = `${BASE_URL}/api/Categories`;

// Configure axios to handle HTTPS development certificates
const axiosInstance = axios.create({
    timeout: 30000, // Increased timeout to 30 seconds
    httpsAgent: process.env.NODE_ENV === 'development' ? 
        new https.Agent({ rejectUnauthorized: false }) : undefined,
    maxRedirects: 3,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`=== Navigation API Handler Started (Attempt ${attempt}/${maxRetries}) ===`);
            console.log('Environment:', process.env.NODE_ENV);
            console.log('Base URL:', BASE_URL);
            console.log('Categories API URL:', CATEGORIES_API_URL);
            
            // Fetch categories from backend with detailed error handling
            const response = await axiosInstance.get<CategoryResponse[]>(CATEGORIES_API_URL, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'NextJS-Frontend/1.0',
                },
            });
            
            console.log('Backend response status:', response.status);
            console.log('Backend response headers:', response.headers);
            console.log('Backend response data type:', typeof response.data);
            console.log('Backend response data length:', Array.isArray(response.data) ? response.data.length : 'not array');

            if (!response.data || !Array.isArray(response.data)) {
                console.error('Invalid response format - not an array:', response.data);
                throw new Error('Invalid response format from backend - expected array');
            }

            const categories = response.data;
            console.log('Categories received:', categories.map(c => ({ id: c.id, name: c.name, slug: c.categorySlug, active: c.isActivated })));

            // Transform backend data to NavigationLink format
            // For navbar: show ALL activated categories (don't filter by isShowInFooter)
            const dynamicLinks: NavigationLink[] = categories
                .filter((category: CategoryResponse) => {
                    console.log(`Navbar - Category ${category.name} (${category.categorySlug}) - activated: ${category.isActivated}`);
                    return category.isActivated; // Only filter by activation status
                })
                .map((category: CategoryResponse) => ({
                    id: category.id,
                    name: category.name,
                    categorySlug: category.categorySlug,
                    isActivated: category.isActivated,
                    href: `/${category.categorySlug}`,
                    isShowInFooter: category.isShowInFooter ?? false
                } as NavigationLink));

            // Always include the logo/home link
            const homeLink: NavigationLink = { 
                id: 0, 
                name: 'Logo', 
                categorySlug: 'home', 
                isActivated: true, 
                href: '/' 
            };

            // Combine: Home first, then dynamic categories from backend
            const allLinks = [homeLink, ...dynamicLinks];

            console.log('Final navigation links count:', allLinks.length);
            console.log('Final navigation links:', allLinks.map(l => ({ id: l.id, name: l.name, href: l.href })));
            
            res.status(200).json(allLinks);
            return; // Success, exit retry loop
            
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`Attempt ${attempt} failed:`, error);
            
            // If it's a timeout and we have more retries, continue
            if (axios.isAxiosError(error) && error.code === 'ECONNABORTED' && attempt < maxRetries) {
                console.log(`Timeout occurred, retrying in 2 seconds... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
            }
            
            // If it's the last attempt or non-timeout error, break
            break;
        }
    }

    // All attempts failed, return fallback
    console.error('All attempts failed, using fallback navigation');
    
    // Check if it's a network error, timeout, or server error
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
    
    // Return static fallback navigation when backend is completely unavailable
    const fallbackLinks: NavigationLink[] = [
        { id: 0, name: 'Logo', categorySlug: 'home', isActivated: true, href: '/' },
        { id: 1, name: 'سياسة وأمن', categorySlug: 'politics-security', isActivated: true, href: '/politics-security' },
        { id: 2, name: 'البلقان', categorySlug: 'balkans', isActivated: true, href: '/balkans' },
        { id: 3, name: 'اقتصاد', categorySlug: 'economy', isActivated: true, href: '/economy' },
        { id: 4, name: 'رياضة', categorySlug: 'sports', isActivated: true, href: '/sports' },
        { id: 5, name: 'علوم وتكنولوجيا', categorySlug: 'science-technology', isActivated: true, href: '/science-technology' },
        { id: 6, name: 'دولية', categorySlug: 'international', isActivated: true, href: '/international' },
        { id: 7, name: 'رأي', categorySlug: 'opinion', isActivated: true, href: '/opinion' },
        { id: 8, name: 'الحالة الأوروبية', categorySlug: 'european-situation', isActivated: true, href: '/european-situation' },
        { id: 9, name: 'بودكاست', categorySlug: 'podcast', isActivated: true, href: '/podcast' },
    ];
    
    console.log('Using fallback navigation links:', fallbackLinks);
    res.status(200).json({
        links: fallbackLinks,
        fallback: true,
        error: errorMessage
    });
}
