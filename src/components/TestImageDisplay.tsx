"use client";

import React from 'react';
import ArticleImage from './ArticleImage';

interface TestImageDisplayProps {
  imageUrl?: string;
  title?: string;
  description?: string;
}

const TestImageDisplay: React.FC<TestImageDisplayProps> = ({
  imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com'}/uploads/images/2e18a6ef-5830-41ac-a7c8-7af1229b91c9_Food.PNG`,
  title = "Test Image Display",
  description = "Testing image display with the provided URL"
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
        {title}
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Image URL:</p>
        <code className="block p-2 bg-gray-100 rounded text-xs break-all">
          {imageUrl}
        </code>
      </div>

      {/* Image Display using ArticleImage component */}
      <div className="relative w-full h-64 md:h-96 mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <ArticleImage
          src={imageUrl}
          alt={description}
          className="w-full h-full object-cover"
          fallbackElement={
            <div className="w-full h-full bg-red-100 border-2 border-red-300 border-dashed flex items-center justify-center">
              <div className="text-red-600 text-center">
                <div className="text-3xl mb-2">❌</div>
                <p className="text-sm font-medium">Failed to load image</p>
                <p className="text-xs mt-1">Check console for details</p>
              </div>
            </div>
          }
        />
      </div>

      {/* Direct img tag for comparison */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Direct img tag (for comparison):</h3>
        <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={description || "test image"}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              console.error('Direct img tag failed to load:', imageUrl);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => {
              console.log('Direct img tag loaded successfully:', imageUrl);
            }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="mb-1"><strong>Description:</strong> {description}</p>
        <p><strong>Note:</strong> Check browser console for detailed loading information.</p>
      </div>
    </div>
  );
};

export default TestImageDisplay;