import { useAuth } from '../data/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../data/PostContext';
import PostCard from '../components/ui/PostCard';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';

export default function UserDashboard() {
  const { currentUser, logout } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const publishedPosts = posts.filter(p => p.status === 'published');
  
  const q = (params.get('q') || '').toLowerCase();
  const matchesQuery = (p) => 
    p.title.toLowerCase().includes(q) || 
    p.content.toLowerCase().includes(q) || 
    (Array.isArray(p.tags) && p.tags.join(',').toLowerCase().includes(q));
  
  const filtered = publishedPosts.filter(p => !q || matchesQuery(p));

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
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
              B
            </div>
            <div>
              <h1 className="text-lg font-bold">User Dashboard</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Welcome {currentUser?.firstName} {currentUser?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="btn-outline text-sm"
            >
              View Blog
            </button>
            <button
              onClick={logout}
              className="btn-outline text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold">Published Posts</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View all published posts
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              className="input w-auto"
              placeholder="Search posts..."
              value={q}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                const v = e.target.value;
                if (v) next.set('q', v);
                else next.delete('q');
                next.set('page', '1');
                setParams(next, { replace: true });
              }}
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title={q ? 'No results found' : 'No posts published yet'}
              description={q ? 'Try adjusting your search' : 'New posts will be added soon'}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => (
                <PostCard
                  key={p.id}
                  title={p.title}
                  excerpt={p.content}
                  image={p.image}
                  imgUrl={p.imgUrl}
                  tags={p.tags}
                  category={p.category}
                  date={new Date(p.createdAt).toLocaleDateString()}
                  onClick={() => navigate(`/post/${p.id}`)}
                />
              ))}
            </div>
          )}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      </main>
    </div>
  );
}

