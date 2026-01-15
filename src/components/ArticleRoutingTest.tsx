"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { articlesApi, categoriesApi } from '../app/lib/api';
import { AllArticles, AllCategories } from '../app/types/Articles';
import { generateArticleUrl, createSlug } from '../app/lib/urlUtils';

const ArticleRoutingTest = () => {
  const [articles, setArticles] = useState<AllArticles[]>([]);
  const [categories, setCategories] = useState<AllCategories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, categoriesData] = await Promise.all([
          articlesApi.getAll(),
          categoriesApi.getAll()
        ]);
        setArticles(articlesData.filter(a => a.isPublished).slice(0, 5));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading test data...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Article Routing Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">URL Format Examples</h2>
          
          {articles.map(article => {
            const category = categories.find(c => c.id === article.categoryId);
            const newUrl = category ? generateArticleUrl(article, category) : `/article/${article.id}`;
            const oldUrl = `/article/${article.id}`;
            
            return (
              <div key={article.id} className="mb-6 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{article.articleTitle}</h3>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Category:</strong> {category?.name || 'Unknown'}
                  </div>
                  <div>
                    <strong>Article ID:</strong> {article.id}
                  </div>
                  <div>
                    <strong>Old URL:</strong> 
                    <Link href={oldUrl} className="text-blue-600 hover:underline ml-2">
                      {oldUrl}
                    </Link>
                  </div>
                  <div>
                    <strong>New URL:</strong> 
                    <Link href={newUrl} className="text-primaryOther hover:underline ml-2">
                      {newUrl}
                    </Link>
                  </div>
                  <div>
                    <strong>Generated Slug:</strong> {article.id}
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Link 
                    href={oldUrl}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Test Old URL
                  </Link>
                  <Link 
                    href={newUrl}
                    className="bg-primaryOther text-white px-3 py-1 rounded text-sm hover:bg-primaryOther/80"
                  >
                    Test New URL
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="p-3 border rounded">
                <div className="font-semibold">{category.name}</div>
                <div className="text-sm text-gray-600">ID: {category.id}</div>
                <div className="text-sm text-gray-600">
                  Slug: {category.categorySlug || createSlug(category.name)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleRoutingTest;
