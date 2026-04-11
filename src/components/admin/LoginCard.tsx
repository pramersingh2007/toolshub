'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

export function LoginCard({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Remove.parmar' && password === '@remove123PARMAR') {
      sessionStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto glass modern-shadow rounded-2xl p-8 mt-20">
      <div className="text-center mb-8">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faLock} className="text-2xl text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Secure access to ToolSuite Admin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="Enter password"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faUnlockAlt} className="mr-2" />
          Login
        </button>
      </form>
    </div>
  );
}
