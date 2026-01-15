import { useQuery } from '@tanstack/react-query';

interface SearchResult {
    id: string;
    articleTitle: string;
    articleSummary: string;
    articleContent: string;
    imagePath: string;
    createdDate: string;
    updatedDate: string;
    categoryId: string;
}

interface SearchResponse {
    query: string;
    totalResults: number;
    returnedResults: number;
    articles: SearchResult[];
    error?: string;
}

interface SearchParams {
    query: string;
    sortBy?: 'createdDate' | 'updatedDate' | 'title';
    order?: 'asc' | 'desc';
    limit?: number;
}

const searchArticles = async (params: SearchParams): Promise<SearchResponse> => {
    const searchParams = new URLSearchParams({
        query: params.query.trim(),
        sortBy: params.sortBy || 'createdDate',
        order: params.order || 'desc',
        limit: (params.limit || 5).toString()
    });

    const response = await fetch(`/api/search?${searchParams}`);
    
    if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error);
    }

    return data;
};

export const useSearch = (params: SearchParams, enabled: boolean = false) => {
    return useQuery({
        queryKey: ['search', params.query, params.sortBy, params.order, params.limit],
        queryFn: () => searchArticles(params),
        enabled: enabled && !!params.query.trim(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

// Hook for navigation search with different cache settings
export const useNavigationSearch = (query: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ['navigation-search', query],
        queryFn: () => searchArticles({ query, limit: 5 }),
        enabled: enabled && !!query.trim(),
        staleTime: 2 * 60 * 1000, // 2 minutes for navigation
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};