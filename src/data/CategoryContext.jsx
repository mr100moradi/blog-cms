import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const CategoryContext = createContext(null);
const STORAGE_KEY = 'blog_categories';

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useLocalStorage(STORAGE_KEY, []);

  const addCategory = useCallback((name) => {
    const n = String(name || '').trim();
    if (!n) return null;
    if (categories.includes(n)) return n;
    setCategories((prev) => [...prev, n].sort());
    return n;
  }, [categories, setCategories]);

  const renameCategory = useCallback((oldName, newName) => {
    const o = String(oldName || '').trim();
    const n = String(newName || '').trim();
    if (!o || !n || o === n) return;
    setCategories((prev) => Array.from(new Set(prev.map((c) => (c === o ? n : c)))).sort());
    return { oldName: o, newName: n };
  }, [setCategories]);

  const deleteCategory = useCallback((name) => {
    const n = String(name || '').trim();
    if (!n) return;
    setCategories((prev) => prev.filter((c) => c !== n));
    return n;
  }, [setCategories]);

  const value = useMemo(() => ({ categories, addCategory, renameCategory, deleteCategory }), [categories, addCategory, renameCategory, deleteCategory]);
  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories must be used within CategoryProvider');
  return ctx;
}


