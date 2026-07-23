import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const CommentContext = createContext(null);
const STORAGE_KEY = 'blog_comments';

export function CommentProvider({ children }) {
  const [comments, setComments] = useLocalStorage(STORAGE_KEY, []);

  const addComment = useCallback((postId, author, content) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const safeAuthor = String(author || '').trim() || 'Anonymous';
    const safeContent = String(content || '').trim();
    if (!postId || !safeContent) return null;
    const newComment = { id, postId, author: safeAuthor, content: safeContent, createdAt };
    setComments((prev) => [newComment, ...prev]);
    return newComment;
  }, [setComments]);

  const deleteComment = useCallback((id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }, [setComments]);

  const getCommentsForPost = useCallback((postId) => (
    comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  ), [comments]);

  const value = useMemo(() => ({ comments, addComment, deleteComment, getCommentsForPost }), [comments, addComment, deleteComment, getCommentsForPost]);

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
}

export function useComments() {
  const ctx = useContext(CommentContext);
  if (!ctx) throw new Error('useComments must be used within CommentProvider');
  return ctx;
}


