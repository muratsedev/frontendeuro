'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AboutRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/about-us');
  }, [router]);

  return null;
}
