import EmptyState from '../components/ui/EmptyState';
import PostCard from '../components/ui/PostCard';
import { usePosts } from '../data/PostContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import { useState } from 'react';
import { useToast } from '../components/ui/ToastProvider';
import { useCategories } from '../data/CategoryContext';

export default function Home() {
  const { posts, deletePost } = usePosts();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { show } = useToast();
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const { categories } = useCategories();
  const q = (params.get('q') || '').toLowerCase();
  const tag = (params.get('tag') || '').toLowerCase();
  const cat = (params.get('cat') || '').toLowerCase();
  const status = (params.get('status') || '').toLowerCase(); // '', 'published', 'draft'
  const matchesQuery = (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || (Array.isArray(p.tags) && p.tags.join(',').toLowerCase().includes(q));
  const matchesTag = (p) => !tag || (Array.isArray(p.tags) && p.tags.map((t) => t.toLowerCase()).includes(tag));
  const matchesCat = (p) => !cat || (p.category || '').toLowerCase() === cat;
  const matchesStatus = (p) => !status || (p.status || 'published').toLowerCase() === status;
  const filtered = posts.filter((p) => (!q || matchesQuery(p)) && matchesTag(p) && matchesCat(p) && matchesStatus(p));

  const page = Math.max(1, parseInt(params.get('page') || '1', 10));
  const perPage = Math.max(1, parseInt(params.get('perPage') || '6', 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);
  const setPage = (next) => {
    const qp = new URLSearchParams(params);
    qp.set('page', String(next));
    setParams(qp, { replace: true });
  };
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold">Posts</h2>
          <p className="text-sm text-gray-600">Your posts will appear here.</p>
        </div>
        <button onClick={() => navigate('/admin/new')} className="btn-primary">New Post</button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input w-auto"
          placeholder="Search posts..."
          value={q}
          onChange={(e) => { const next = new URLSearchParams(params); const v = e.target.value; if (v) next.set('q', v); else next.delete('q'); next.set('page', '1'); setParams(next, { replace: true }); }}
        />
        <select
          value={status}
          onChange={(e) => { const next = new URLSearchParams(params); const v = e.target.value; if (v) next.set('status', v); else next.delete('status'); next.set('page', '1'); setParams(next, { replace: true }); }}
          className="input w-auto"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={cat}
          onChange={(e) => { const next = new URLSearchParams(params); const v = e.target.value; if (v) next.set('cat', v); else next.delete('cat'); next.set('page', '1'); setParams(next, { replace: true }); }}
          className="input w-auto"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c.toLowerCase()}>{c}</option>
          ))}
        </select>
        <select
          value={String(perPage)}
          onChange={(e) => { const next = new URLSearchParams(params); next.set('perPage', e.target.value); next.set('page', '1'); setParams(next, { replace: true }); }}
          className="input w-auto"
        >
          <option value="6">6 / page</option>
          <option value="9">9 / page</option>
          <option value="12">12 / page</option>
          <option value="18">18 / page</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="space-y-3">
          <EmptyState title={q || tag || cat || status ? 'No results' : 'No posts yet'} description={q || tag || cat || status ? 'Try adjusting your search or clear filters.' : 'Click New Post to create your first post.'} />
          {(q || tag || cat || status) && (
            <div>
              <button className="btn-outline" onClick={() => { const next = new URLSearchParams(params); next.delete('q'); next.delete('tag'); next.delete('cat'); next.delete('status'); next.set('page', '1'); setParams(next, { replace: true }); }}>Clear filters</button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((p) => (
            <PostCard key={p.id} title={p.title} excerpt={p.content} image={p.image} imgUrl={p.imgUrl} tags={p.tags} category={p.category} date={new Date(p.createdAt).toLocaleDateString()} onClick={() => navigate(`/admin/post/${p.id}`)} onEdit={() => navigate(`/admin/edit/${p.id}`)} onDelete={() => setConfirm({ open: true, id: p.id })} onTagClick={(t) => {
              const next = new URLSearchParams(params);
              next.set('tag', t);
              next.set('page', '1');
              setParams(next, { replace: true });
            }} onCategoryClick={(c) => {
              const next = new URLSearchParams(params);
              next.set('cat', c);
              next.set('page', '1');
              setParams(next, { replace: true });
            }} />
          ))}
        </div>
      )}
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      <Modal open={confirm.open} title="Delete post?" onClose={() => setConfirm({ open: false, id: null })} onConfirm={() => { deletePost(confirm.id); setConfirm({ open: false, id: null }); show('Post deleted', 'success'); }}>This action cannot be undone.</Modal>
    </section>
  );
}


