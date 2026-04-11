'use client';

import { useState, useEffect } from 'react';
import { storage, ApiKey } from '@/lib/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faKey, faTrash, faExclamationCircle, faCheckCircle, faCopy } from '@fortawesome/free-solid-svg-icons';

export function KeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    // Load keys
    setKeys(storage.getKeys());
    
    // Auto-sync by setting up an interval to refresh from localStorage
    const interval = setInterval(() => {
      setKeys(storage.getKeys());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAdd = (newKey: string, limit: number) => {
    if (newKey && !keys.find(k => k.key === newKey)) {
      storage.addKey(newKey, limit);
      setKeys(storage.getKeys());
    }
  };

  const handleRemove = (keyToRemove: string) => {
    storage.removeKey(keyToRemove);
    setKeys(storage.getKeys());
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-white/20 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FontAwesomeIcon icon={faKey} className="mr-3 text-primary" />
            API Key Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your remove.bg API keys. The system uses round-robin rotation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddKeyForm onAdd={handleAdd} />
        </div>
        <div className="lg:col-span-2">
          <KeyTable keys={keys} onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
}

function AddKeyForm({ onAdd }: { onAdd: (key: string, limit: number) => void }) {
  const [apiKey, setApiKey] = useState('');
  const [limit, setLimit] = useState(50);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setError('API Key is required');
      return;
    }
    if (limit <= 0) {
      setError('Limit must be greater than 0');
      return;
    }
    
    onAdd(apiKey, limit);
    setApiKey('');
    setLimit(50);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass modern-shadow rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Key</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Remove.bg API Key
          </label>
          <input
            type="text"
            required
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
            placeholder="e.g. jHk9...23L"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Usage Limit (Monthly)
          </label>
          <input
            type="number"
            required
            min="1"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-xl transition-all flex items-center justify-center mt-2"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Key
        </button>
      </div>
    </form>
  );
}

function KeyTable({ keys, onRemove }: { keys: ApiKey[], onRemove: (k: string) => void }) {
  const maskKey = (key: string) => {
    if (key.length <= 8) return '****';
    return `${key.slice(0, 4)}********${key.slice(-4)}`;
  };

  return (
    <div className="glass modern-shadow rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Masked Key</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Usage Bar</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {keys.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No API keys added yet. Add one to start processing images.
                </td>
              </tr>
            )}
            
            {keys.map((keyObj) => {
              const usagePercent = Math.min((keyObj.used / keyObj.limit) * 100, 100);
              const isExhausted = keyObj.used >= keyObj.limit;

              return (
                <tr key={keyObj.key} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                        {maskKey(keyObj.key)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 w-1/3">
                    <div className="flex flex-col space-y-1 w-full max-w-xs">
                      <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>{keyObj.used}</span>
                        <span>{keyObj.limit}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full ${isExhausted ? 'bg-red-500' : 'bg-green-500'} transition-all duration-500`} 
                          style={{ width: `${usagePercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isExhausted ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1.5" /> EXHAUSTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5" /> ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onRemove(keyObj.key)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-8 h-8 rounded-full transition-colors flex items-center justify-center ml-auto"
                      title="Delete Key"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
