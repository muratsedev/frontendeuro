'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/privacy-policy');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">جاري التوجيه...</p>
    </div>
  );
}