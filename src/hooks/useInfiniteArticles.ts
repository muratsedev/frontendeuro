"use client";
import { useState, useCallback, useEffect, useRef } from "react";

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
    tagId?: number;
    tagName?: string;
    editorChoice?: boolean;
    upperArticleId?: number;
    upperArticleName?: string;
};

interface UseInfiniteArticlesOptions {
    pageSize?: number;
    categoryId?: number;
}

interface UseInfiniteArticlesResult {
    articles: Article[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    totalCount: number;
    loadMore: () => void;
    reset: () => void;
}

export function useInfiniteArticles({
    pageSize = 10,
    categoryId,
}: UseInfiniteArticlesOptions = {}): UseInfiniteArticlesResult {
    const [articles, setArticles] = useState<Article[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Track whether a fetch is in flight to avoid race conditions
    const fetchingRef = useRef(false);

    const fetchPage = useCallback(
        async (pageNum: number, replace: boolean): Promise<void> => {
            if (fetchingRef.current) return;
            fetchingRef.current = true;
            try {
                const params = new URLSearchParams({
                    page: pageNum.toString(),
                    pageSize: pageSize.toString(),
                });
                if (categoryId !== undefined) {
                    params.append("categoryId", categoryId.toString());
                }

                const response = await fetch(`/api/articles-paged?${params.toString()}`);
                if (!response.ok) throw new Error("Failed to fetch articles");

                const data = await response.json();
                const items: Article[] = data.items ?? [];

                setTotalCount(data.totalCount ?? 0);
                setHasMore(data.hasMore ?? false);
                setArticles((prev) => (replace ? items : [...prev, ...items]));
            } finally {
                fetchingRef.current = false;
            }
        },
        [pageSize, categoryId]
    );

    // Initial load — reset when pageSize or categoryId changes
    useEffect(() => {
        setArticles([]);
        setPage(1);
        setHasMore(true);
        setError(null);
        setLoading(true);
        fetchPage(1, true)
            .catch((err) => {
                console.error(err);
                setError("فشل في تحميل المقالات");
            })
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, categoryId]);

    const loadMore = useCallback(() => {
        if (fetchingRef.current || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        setLoadingMore(true);
        fetchPage(nextPage, false)
            .catch((err) => {
                console.error(err);
                setError("فشل في تحميل المزيد من المقالات");
            })
            .finally(() => setLoadingMore(false));
    }, [fetchPage, hasMore, page]);

    const reset = useCallback(() => {
        setArticles([]);
        setPage(1);
        setHasMore(true);
        setTotalCount(0);
        setError(null);
        setLoading(true);
        fetchPage(1, true)
            .catch((err) => {
                console.error(err);
                setError("فشل في تحميل المقالات");
            })
            .finally(() => setLoading(false));
    }, [fetchPage]);

    return { articles, loading, loadingMore, error, hasMore, totalCount, loadMore, reset };
}
