"use client";

import TestImageDisplay from '../../components/TestImageDisplay';
import Link from 'next/link';

export default function ImageTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Image Display Test
        </h1>
        
        <TestImageDisplay
          imageUrl={`${process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com'}/uploads/images/2e18a6ef-5830-41ac-a7c8-7af1229b91c9_Food.PNG`}
          title="Food Image Test"
          description="Testing the Food.PNG image from backend API"
        />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}