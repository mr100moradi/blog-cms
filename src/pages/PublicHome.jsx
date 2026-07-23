import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePosts } from '../data/PostContext';
import { useCategories } from '../data/CategoryContext';
import PostCard from '../components/ui/PostCard';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';

export default function PublicHome() {
  const { posts } = usePosts();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { categories } = useCategories();

  const q = (params.get('q') || '').toLowerCase();
  const tag = (params.get('tag') || '').toLowerCase();
  const cat = (params.get('cat') || '').toLowerCase();
  const sizeParam = parseInt(params.get('size') || '8', 10);
  const pageSize = [6, 8, 9, 12].includes(sizeParam) ? sizeParam : 8;

  const published = useMemo(() => posts.filter((p) => (p.status || 'published') === 'published'), [posts]);

  const matchesQuery = (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || (Array.isArray(p.tags) && p.tags.join(',').toLowerCase().includes(q));
  const matchesTag = (p) => !tag || (Array.isArray(p.tags) && p.tags.map((t) => t.toLowerCase()).includes(tag));
  const matchesCat = (p) => !cat || (p.category || '').toLowerCase() === cat;
  const filtered = published.filter((p) => (!q || matchesQuery(p)) && matchesTag(p) && matchesCat(p));

  const page = Math.max(1, parseInt(params.get('page') || '1', 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const setPage = (next) => {
    const qp = new URLSearchParams(params);
    qp.set('page', String(next));
    setParams(qp, { replace: true });
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Latest posts</h2>
        <p className="text-sm text-gray-600">Browse recently published articles.</p>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between flex-wrap dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:w-72">
            <label className="block text-xs text-gray-500">Search</label>
            <input
              type="search"
              placeholder="Search posts"
              value={params.get('q') || ''}
              onChange={(e) => {
                const val = e.target.value;
                const next = new URLSearchParams(params);
                if (val) next.set('q', val); else next.delete('q');
                next.set('page', '1');
                setParams(next, { replace: true });
              }}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950"
            />
          </div>
          <div className="sm:w-56">
            <label className="block text-xs text-gray-500">Category</label>
            <select
              value={params.get('cat') || ''}
              onChange={(e) => {
                const v = e.target.value;
                const next = new URLSearchParams(params);
                if (v) next.set('cat', v); else next.delete('cat');
                next.set('page', '1');
                setParams(next, { replace: true });
              }}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="sm:w-44">
            <label className="block text-xs text-gray-500">Items per page</label>
            <select
              value={String(pageSize)}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                next.set('size', e.target.value);
                next.set('page', '1');
                setParams(next, { replace: true });
              }}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950"
            >
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="12">12</option>
            </select>
          </div>
          {(q || tag || cat) && (
            <button
              className="btn-outline"
              onClick={() => {
                const next = new URLSearchParams(params);
                next.delete('q');
                next.delete('tag');
                next.delete('cat');
                next.set('page', '1');
                setParams(next, { replace: true });
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {(tag || cat) && (
        <div className="flex flex-wrap items-center gap-2">
          {cat && (
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900">
              Category: {params.get('cat')}
              <button
                className="rounded border border-gray-300 px-1 text-gray-600 hover:bg-gray-50"
                onClick={() => { const next = new URLSearchParams(params); next.delete('cat'); next.set('page', '1'); setParams(next, { replace: true }); }}
                aria-label="Clear category filter"
              >×</button>
            </span>
          )}
          {tag && (
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900">
              Tag: #{params.get('tag')}
              <button
                className="rounded border border-gray-300 px-1 text-gray-600 hover:bg-gray-50"
                onClick={() => { const next = new URLSearchParams(params); next.delete('tag'); next.set('page', '1'); setParams(next, { replace: true }); }}
                aria-label="Clear tag filter"
              >×</button>
            </span>
          )}
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="space-y-3">
          <EmptyState title={q || tag || cat ? 'No results found' : 'No posts published yet'} description={q || tag || cat ? 'Try adjusting your filters.' : 'New content will be added soon.'} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((p) => (
            <PostCard key={p.id} title={p.title} excerpt={p.content} tags={p.tags} category={p.category} image={p.image} imgUrl={p.imgUrl} date={new Date(p.createdAt).toLocaleDateString()} onClick={() => navigate(`/post/${p.id}`)} onTagClick={(t) => {
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
    </section>
  );
}


