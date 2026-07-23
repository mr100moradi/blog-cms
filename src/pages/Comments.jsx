import { usePosts } from '../data/PostContext';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Tooltip from '../components/ui/Tooltip';

export default function Comments() {
  const { posts, deleteComment, editComment } = usePosts();
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') || '').toLowerCase();
  const postId = params.get('postId') || '';
  const all = useMemo(
    () => posts.flatMap((p) => (p.comments || []).map((c) => ({
      ...c,
      postId: p.id,
      postTitle: p.title,
      postImage: p.image || p.imgUrl || '',
    }))
  ), [posts]);
  const filteredAll = all.filter((c) =>
    (!q || c.content.toLowerCase().includes(q) || (c.author || '').toLowerCase().includes(q) || c.postTitle.toLowerCase().includes(q)) &&
    (!postId || c.postId === postId)
  );
  const page = Math.max(1, parseInt(params.get('page') || '1', 10));
  const perPage = Math.max(1, parseInt(params.get('perPage') || '10', 10));
  const totalPages = Math.max(1, Math.ceil(filteredAll.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const filtered = filteredAll.slice(start, start + perPage);
  const [editing, setEditing] = useState(null); // { postId, id, content }
  const [content, setContent] = useState('');

  const startEdit = (c) => { setEditing({ postId: c.postId, id: c.id }); setContent(c.content || ''); };
  const saveEdit = () => { if (!editing) return; editComment(editing.postId, editing.id, { content }); setEditing(null); };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Comments</h2>
        <p className="text-sm text-gray-600">All comments across posts.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input w-auto"
          placeholder="Search comments..."
          value={q}
          onChange={(e) => { const next = new URLSearchParams(params); const v = e.target.value; if (v) next.set('q', v); else next.delete('q'); next.set('page', '1'); setParams(next, { replace: true }); }}
        />
        <select
          className="input w-auto"
          value={postId}
          onChange={(e) => { const next = new URLSearchParams(params); const v = e.target.value; if (v) next.set('postId', v); else next.delete('postId'); next.set('page', '1'); setParams(next, { replace: true }); }}
        >
          <option value="">All posts</option>
          {posts.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
        </select>
        {(q || postId) && (
          <button className="btn-outline" onClick={() => { const next = new URLSearchParams(params); next.delete('q'); next.delete('postId'); next.delete('page'); next.delete('perPage'); setParams(next, { replace: true }); }}>Clear</button>
        )}
        <select
          className="input w-auto"
          value={String(perPage)}
          onChange={(e) => { const next = new URLSearchParams(params); next.set('perPage', e.target.value); next.set('page', '1'); setParams(next, { replace: true }); }}
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="30">30 / page</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-600">No comments yet.</p>
      ) : (
        <>
          <div className="space-y-3">
            {filtered.map((c) => (
              <div key={`${c.postId}-${c.id}`} className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                {c.postImage && (
                  <div className='rounded overflow-hidden'>
                    <img src={c.postImage} alt="post cover" className="h-14 w-20 shrink-0 object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="truncate">Post: {c.postTitle}</span>
                    <span className="truncate">By: {c.author || 'Anonymous'}</span>
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  {editing && editing.id === c.id && editing.postId === c.postId ? (
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="mt-2 w-full input" />
                  ) : (
                    <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{c.content}</p>
                  )}
                </div>
                <div className="shrink-0 space-x-2 rtl:space-x-reverse">
                {editing && editing.id === c.id && editing.postId === c.postId ? (
                  <>
                    <button className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
                    <button className="btn-primary" onClick={saveEdit}>Save</button>
                  </>
                ) : (
                  <>
                    <Tooltip label="Edit">
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        aria-label="Edit"
                        onClick={() => startEdit(c)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    </Tooltip>
                    <Tooltip label="Delete">
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700"
                        aria-label="Delete"
                        onClick={() => deleteComment(c.postId, c.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </>
                )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2">
              <button disabled={currentPage <= 1} onClick={() => { const next = new URLSearchParams(params); next.set('page', String(currentPage - 1)); setParams(next, { replace: true }); }} className={`btn-outline ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>Prev</button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages} ({filteredAll.length} comments)</span>
              <button disabled={currentPage >= totalPages} onClick={() => { const next = new URLSearchParams(params); next.set('page', String(currentPage + 1)); setParams(next, { replace: true }); }} className={`btn-outline ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}


