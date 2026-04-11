export interface ApiKey {
  key: string;
  used: number;
  limit: number;
}

const STORAGE_KEY = 'remove_bg_pool';

export const storage = {
  getKeys: (): ApiKey[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveKeys: (keys: ApiKey[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  },

  addKey: (key: string, limit: number = 50) => {
    const keys = storage.getKeys();
    if (!keys.find((k) => k.key === key)) {
      keys.push({ key, used: 0, limit });
      storage.saveKeys(keys);
    }
  },

  removeKey: (key: string) => {
    const keys = storage.getKeys();
    storage.saveKeys(keys.filter((k) => k.key !== key));
  },

  getAvailableKey: (): ApiKey | null => {
    const keys = storage.getKeys();
    // Find the first key that hasn't reached its limit
    const availableKey = keys.find((k) => k.used < k.limit);
    return availableKey || null;
  },

  incrementKeyUsage: (keyToIncrement: string) => {
    const keys = storage.getKeys();
    const keyIndex = keys.findIndex((k) => k.key === keyToIncrement);
    if (keyIndex !== -1) {
      keys[keyIndex].used += 1;
      storage.saveKeys(keys);
    }
  }
};
