'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LoginCard } from '@/components/admin/LoginCard';
import { KeyManager } from '@/components/admin/KeyManager';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    const isLogged = sessionStorage.getItem('admin_logged_in') === 'true';
    if (isLogged) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] hero-gradient px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          {isAuthenticated ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-end">
                <button
                  onClick={handleLogout}
                  className="bg-white/50 hover:bg-white/80 dark:bg-black/50 dark:hover:bg-black/80 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-xl transition-all"
                >
                  Logout
                </button>
              </div>
              <KeyManager />
            </div>
          ) : (
            <LoginCard onLogin={handleLogin} />
          )}
        </div>
      </main>
    </>
  );
}
