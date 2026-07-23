import { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const PostContext = createContext(null);

const STORAGE_KEY = 'blog_posts';

export function PostProvider({ children }) {
  const [posts, setPosts] = useLocalStorage(STORAGE_KEY, []);

  const getDefaultImgUrl = useCallback((seed) => {
    return `https://picsum.photos/seed/${seed}/800/450`;
  }, []);

  const addPost = useCallback((post) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const tagsArray = Array.isArray(post.tags)
      ? post.tags
      : String(post.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
    const status = post.status === 'draft' ? 'draft' : 'published';
    const category = (post.category || '').trim();
    const image = post.image || '';
    const imgUrl = post.imgUrl || getDefaultImgUrl(id);
    const newPost = { id, title: post.title, content: post.content, tags: tagsArray, category, status, image, imgUrl, createdAt, updatedAt: createdAt, comments: [] };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, [setPosts, getDefaultImgUrl]);

  const editPost = useCallback((id, updates) => {
    const updatedAt = new Date().toISOString();
    setPosts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const tagsArray = updates.tags !== undefined
        ? (Array.isArray(updates.tags)
            ? updates.tags
            : String(updates.tags || '')
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean))
        : p.tags;
      const status = updates.status ? (updates.status === 'draft' ? 'draft' : 'published') : p.status || 'published';
      const category = updates.category !== undefined ? String(updates.category || '').trim() : p.category || '';
      const comments = Array.isArray(p.comments) ? p.comments : [];
      const image = updates.image !== undefined ? updates.image : p.image || '';
      const imgUrl = updates.imgUrl !== undefined ? updates.imgUrl : (p.imgUrl || getDefaultImgUrl(p.id));
      return { ...p, ...updates, tags: tagsArray, status, category, image, imgUrl, comments, updatedAt };
    }));
  }, [setPosts, getDefaultImgUrl]);

  const deletePost = useCallback((id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, [setPosts]);

  const getPost = useCallback((id) => posts.find((p) => p.id === id) || null, [posts]);

  const replaceAllPosts = useCallback((next) => {
    setPosts(Array.isArray(next) ? next : []);
  }, [setPosts]);

  // Backfill imgUrl for existing posts without it
  useEffect(() => {
    if (!Array.isArray(posts) || posts.length === 0) return;
    const needsBackfill = posts.some((p) => !p.imgUrl);
    if (needsBackfill) {
      setPosts((prev) => prev.map((p) => ({ ...p, imgUrl: p.imgUrl || getDefaultImgUrl(p.id) })));
    }
  }, [posts, setPosts, getDefaultImgUrl]);

  const addComment = useCallback((postId, comment) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const comments = Array.isArray(p.comments) ? p.comments : [];
      const newComment = { id, author: comment.author || 'Admin', content: comment.content || '', createdAt };
      return { ...p, comments: [newComment, ...comments] };
    }));
    return id;
  }, [setPosts]);

  const deleteComment = useCallback((postId, commentId) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments: (p.comments || []).filter((c) => c.id !== commentId) } : p));
  }, [setPosts]);

  const editComment = useCallback((postId, commentId, updates) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: (p.comments || []).map((c) => c.id === commentId ? { ...c, ...updates } : c),
      };
    }));
  }, [setPosts]);

  const value = useMemo(() => ({ posts, addPost, editPost, deletePost, getPost, replaceAllPosts, addComment, deleteComment, editComment }), [posts, addPost, editPost, deletePost, getPost, replaceAllPosts, addComment, deleteComment, editComment]);
  // Helpers for category maintenance can be consumed by Categories UI
  value.renameCategoryInPosts = useCallback((oldName, newName) => {
    const o = String(oldName || '').trim();
    const n = String(newName || '').trim();
    if (!o || !n) return;
    setPosts((prev) => prev.map((p) => ({ ...p, category: (p.category || '') === o ? n : p.category })));
  }, [setPosts]);
  value.clearCategoryInPosts = useCallback((name) => {
    const n = String(name || '').trim();
    if (!n) return;
    setPosts((prev) => prev.map((p) => ({ ...p, category: (p.category || '') === n ? '' : p.category })));
  }, [setPosts]);

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error('usePosts must be used within PostProvider');
  return ctx;
}


