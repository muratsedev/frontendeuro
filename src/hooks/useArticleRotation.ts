import { useState, useEffect, useCallback } from 'react';

export interface Article {
  id: string;
  articleTitle: string;
  articleSummary: string;
  articleContent: string;
  imagePath: string;
  createdDate: string;
  updatedDate: string;
  isPublished: boolean;
  categoryId: number;
}

interface UseArticleRotationProps {
  articles: Article[];
  categoryId: number;
  maxArticles?: number;
}

interface RotationState {
  isRotating: boolean;
  previousArticleIds: string[];
  newArticleId: string | null;
  rotationTimestamp: number;
}

/**
 * Custom hook for managing article rotation animations
 * Detects when new articles are added and triggers smooth rotation animations
 */
export const useArticleRotation = ({
  articles,
  categoryId,
  maxArticles = 5
}: UseArticleRotationProps) => {
  const [rotationState, setRotationState] = useState<RotationState>({
    isRotating: false,
    previousArticleIds: [],
    newArticleId: null,
    rotationTimestamp: 0
  });

  // Sort and filter articles
  const sortedArticles = articles
    .filter(article => article.isPublished && article.categoryId === categoryId)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, maxArticles);

  // Detect rotation when articles change
  useEffect(() => {
    if (sortedArticles.length === 0) return;

    const currentArticleIds = sortedArticles.map(article => article.id);
    
    setRotationState(prev => {
      const { previousArticleIds } = prev;
      
      // Check if this is the first load
      if (previousArticleIds.length === 0) {
        return {
          ...prev,
          previousArticleIds: currentArticleIds
        };
      }

      // Check if we have a new article at the top position (big image)
      const hasNewTopArticle = currentArticleIds[0] !== previousArticleIds[0];
      
      // Check if any new articles were added
      const newArticleIds = currentArticleIds.filter(id => !previousArticleIds.includes(id));
      const hasNewArticles = newArticleIds.length > 0;

      if (hasNewTopArticle || hasNewArticles) {
        console.log('🔄 Article rotation detected:', {
          categoryId,
          hasNewTopArticle,
          newArticleIds,
          previousTop: previousArticleIds[0],
          newTop: currentArticleIds[0]
        });

        // Trigger rotation animation
        setTimeout(() => {
          setRotationState(resetPrev => ({
            ...resetPrev,
            isRotating: false,
            newArticleId: null
          }));
        }, 1200); // 1.2 seconds to allow for all animations

        return {
          ...prev,
          isRotating: true,
          newArticleId: newArticleIds[0] || currentArticleIds[0],
          rotationTimestamp: Date.now(),
          previousArticleIds: currentArticleIds
        };
      }
      
      return prev;
    });
  }, [sortedArticles, categoryId]);

  // Manual rotation trigger function
  const triggerRotation = useCallback(() => {
    setRotationState(prev => ({
      ...prev,
      isRotating: true,
      rotationTimestamp: Date.now()
    }));

    setTimeout(() => {
      setRotationState(prev => ({
        ...prev,
        isRotating: false
      }));
    }, 1200);
  }, []);

  // Get rotation class for specific position
  const getRotationClass = useCallback((position: 'big' | 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right') => {
    if (!rotationState.isRotating) return '';
    
    const baseClass = 'article-rotation-animation';
    const positionClass = `rotate-to-${position}`;
    
    return `${baseClass} ${positionClass}`;
  }, [rotationState.isRotating]);

  // Check if specific article is new
  const isNewArticle = useCallback((articleId: string) => {
    return rotationState.newArticleId === articleId;
  }, [rotationState.newArticleId]);

  return {
    // State
    isRotating: rotationState.isRotating,
    newArticleId: rotationState.newArticleId,
    rotationTimestamp: rotationState.rotationTimestamp,
    sortedArticles,
    
    // Functions
    triggerRotation,
    getRotationClass,
    isNewArticle,
    
    // Article position helpers
    bigArticle: sortedArticles[0] || null,
    smallArticles: sortedArticles.slice(1, 5),
    
    // Animation state for each position
    positions: {
      big: sortedArticles[0] || null,
      topRight: sortedArticles[1] || null,
      topLeft: sortedArticles[2] || null,
      bottomLeft: sortedArticles[3] || null,
      bottomRight: sortedArticles[4] || null
    }
  };
};

export default useArticleRotation;