import React from 'react';
import { NewspaperIcon, FolderOpenIcon, Cog6ToothIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { usePosts } from '../../data/PostContext';
import { useCategories } from '../../data/CategoryContext';

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(t);
  }, []);
  const { posts } = usePosts();
  const totalPosts = posts.length;
  const draftsCount = posts.filter((p) => (p.status || 'published') === 'draft').length;
  const commentsCount = posts.reduce((sum, p) => sum + (Array.isArray(p.comments) ? p.comments.length : 0), 0);
  const { categories } = useCategories();
  const categoriesCount = categories.length;
  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:block lg:w-64 shrink-0 border-r border-gray-200 bg-white/60 dark:border-gray-800 dark:bg-gray-900 transition-transform duration-700 ease-out delay-300 ${entered ? 'translate-x-0' : '-translate-x-96'}`}>
        <div className="sticky top-[4.25rem] p-4">
          <nav className="space-y-1">
            <NavLink to="/admin" end className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}>
              <span className="inline-flex items-center gap-2"><NewspaperIcon className="h-5 w-5" /> Posts</span>
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">{totalPosts}</span>
            </NavLink>
            <NavLink to="/admin/drafts" className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}>
              <span className="inline-flex items-center gap-2"><DocumentTextIcon className="h-5 w-5" /> Drafts</span>
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">{draftsCount}</span>
            </NavLink>
            <NavLink to="/admin/categories" className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}>
              <span className="inline-flex items-center gap-2"><FolderOpenIcon className="h-5 w-5" /> Categories</span>
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">{categoriesCount}</span>
            </NavLink>
            <NavLink to="/admin/comments" className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}>
              <span className="inline-flex items-center gap-2"><ChatBubbleLeftRightIcon className="h-5 w-5" /> Comments</span>
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">{commentsCount}</span>
            </NavLink>
            <NavLink to="/admin/settings" className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}>
              <span className="inline-flex items-center gap-2"><Cog6ToothIcon className="h-5 w-5" /> Settings</span>
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button onClick={onClose} className="btn-outline" aria-label="Close menu"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <nav className="space-y-1">
              <NavLink onClick={onClose} to="/admin" end className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <span className="inline-flex items-center gap-2"><NewspaperIcon className="h-5 w-5" /> Posts</span>
                <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">{totalPosts}</span>
              </NavLink>
              <NavLink onClick={onClose} to="/admin/drafts" className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <span className="inline-flex items-center gap-2"><DocumentTextIcon className="h-5 w-5" /> Drafts</span>
                <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">{draftsCount}</span>
              </NavLink>
              <NavLink onClick={onClose} to="/admin/categories" className={({ isActive }) => `flex w/full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <span className="inline-flex items-center gap-2"><FolderOpenIcon className="h-5 w-5" /> Categories</span>
                <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">{categoriesCount}</span>
              </NavLink>
              <NavLink onClick={onClose} to="/admin/comments" className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <span className="inline-flex items-center gap-2"><ChatBubbleLeftRightIcon className="h-5 w-5" /> Comments</span>
                <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">{commentsCount}</span>
              </NavLink>
              <NavLink onClick={onClose} to="/admin/settings" className={({ isActive }) => `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <span className="inline-flex items-center gap-2"><Cog6ToothIcon className="h-5 w-5" /> Settings</span>
              </NavLink>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}


