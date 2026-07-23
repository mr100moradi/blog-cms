import { usePosts } from '../data/PostContext';
import PostCard from '../components/ui/PostCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import { useState } from 'react';
import { useToast } from '../components/ui/ToastProvider';

export default function Drafts() {
  const { posts, deletePost } = usePosts();
  const navigate = useNavigate();
  const { show } = useToast();
  const [params, setParams] = useSearchParams();
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const drafts = posts.filter((p) => (p.status || 'published') === 'draft');
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold">Drafts</h2>
          <p className="text-sm text-gray-600">Posts saved as drafts.</p>
        </div>
      </div>
      {drafts.length === 0 ? (
        <p className="text-sm text-gray-600">No drafts yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drafts.map((p) => (
            <PostCard
              key={p.id}
              title={p.title}
              excerpt={p.content}
              image={p.image}
              imgUrl={p.imgUrl}
              tags={p.tags}
              category={p.category}
              date={new Date(p.createdAt).toLocaleDateString()}
              onClick={() => navigate(`/admin/post/${p.id}`)}
              onEdit={() => navigate(`/admin/edit/${p.id}`)}
              onDelete={() => setConfirm({ open: true, id: p.id })}
              onTagClick={(t) => {
                const next = new URLSearchParams(params);
                next.set('tag', t);
                next.set('page', '1');
                setParams(next, { replace: true });
              }}
              onCategoryClick={(c) => {
                const next = new URLSearchParams(params);
                next.set('cat', c);
                next.set('page', '1');
                setParams(next, { replace: true });
              }}
            />
          ))}
        </div>
      )}
      <Modal open={confirm.open} title="Delete post?" onClose={() => setConfirm({ open: false, id: null })} onConfirm={() => { deletePost(confirm.id); setConfirm({ open: false, id: null }); show('Post deleted', 'success'); }}>This action cannot be undone.</Modal>
    </section>
  );
}


