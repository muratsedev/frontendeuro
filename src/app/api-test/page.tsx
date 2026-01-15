/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testAllEndpoints = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test navigation API
      console.log("Testing navigation API...");
      const navResponse = await fetch("/api/navigation");
      results.navigation = {
        status: navResponse.status,
        data: navResponse.ok ? await navResponse.json() : await navResponse.text()
      };

      // Test articles API
      console.log("Testing articles API...");
      const articlesResponse = await fetch("/api/articles");
      results.articles = {
        status: articlesResponse.status,
        data: articlesResponse.ok ? await articlesResponse.json() : await articlesResponse.text()
      };

      // Test categories with articles API
      console.log("Testing categories-with-articles API...");
      const categoriesResponse = await fetch("/api/categories-with-articles");
      results.categoriesWithArticles = {
        status: categoriesResponse.status,
        data: categoriesResponse.ok ? await categoriesResponse.json() : await categoriesResponse.text()
      };

      // Test specific category (if we have categories)
      if (results.navigation.data && results.navigation.data.length > 1) {
        const testCategoryId = results.navigation.data[1].id; // Get second category (first is usually home)
        console.log("Testing specific category:", testCategoryId);
        
        const categoryArticlesResponse = await fetch(`/api/articles?categoryId=${testCategoryId}`);
        results.categoryArticles = {
          categoryId: testCategoryId,
          status: categoryArticlesResponse.status,
          data: categoryArticlesResponse.ok ? await categoryArticlesResponse.json() : await categoryArticlesResponse.text()
        };

        const categoriesWithArticlesSpecificResponse = await fetch(`/api/categories-with-articles?categoryId=${testCategoryId}`);
        results.categoriesWithArticlesSpecific = {
          categoryId: testCategoryId,
          status: categoriesWithArticlesSpecificResponse.status,
          data: categoriesWithArticlesSpecificResponse.ok ? await categoriesWithArticlesSpecificResponse.json() : await categoriesWithArticlesSpecificResponse.text()
        };
      }

      setTestResults(results);
    } catch (error) {
      console.error("Test error:", error);
      results.error = error;
      setTestResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <button
        onClick={testAllEndpoints}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test All APIs"}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {Object.entries(testResults).map(([key, value]: [string, any]) => (
            <div key={key} className="border p-4 rounded">
              <h3 className="font-bold text-lg mb-2">{key}</h3>
              <div className="bg-gray-100 p-2 rounded">
                <p><strong>Status:</strong> {value.status}</p>
                <p><strong>Data Length:</strong> {Array.isArray(value.data) ? value.data.length : typeof value.data}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer">View Raw Data</summary>
                  <pre className="text-xs mt-2 overflow-auto max-h-40">
                    {JSON.stringify(value.data, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTestPage;
