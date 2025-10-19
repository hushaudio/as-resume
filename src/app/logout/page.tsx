'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Call logout API
    fetch('/api/auth/logout', { 
      method: 'POST',
      redirect: 'manual'
    })
      .then(() => {
        // Redirect to login page
        router.push('/login');
      })
      .catch(() => {
        // Even if logout fails, redirect to login
        router.push('/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Logging out...</h1>
        <p className="text-muted-foreground">Redirecting to login page...</p>
      </div>
    </div>
  );
}
