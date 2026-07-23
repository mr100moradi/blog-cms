import { usePosts } from '../data/PostContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PostCard from '../components/ui/PostCard';
import { useCategories } from '../data/CategoryContext';
import Modal from '../components/ui/Modal';
import { useState } from 'react';
import { useToast } from '../components/ui/ToastProvider';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Tooltip from '../components/ui/Tooltip';

export default function Categories() {
  const { posts, deletePost, renameCategoryInPosts, clearCategoryInPosts } = usePosts();
  const { categories, addCategory, renameCategory, deleteCategory } = useCategories();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedParam = params.get('cat') || '';
  const { show } = useToast();
  const [modal, setModal] = useState({ open: false, kind: 'add', name: '', newName: '' });
  const [confirmPost, setConfirmPost] = useState({ open: false, id: null });
  const selectedLower = selectedParam.toLowerCase();
  const categoriesList = categories; // from context
  const selectedCategory = categoriesList.find((c) => c.toLowerCase() === selectedLower) || '';
  const inCategory = selectedCategory ? posts.filter((p) => (p.category || '') === selectedCategory) : [];
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold dark:text-gray-100">Categories</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Browse posts by category.</p>
        </div>
        <div className="flex gap-2">
          <Tooltip label="Add category">
            <button onClick={() => setModal({ open: true, kind: 'add', name: '', newName: '' })} className="btn-outline inline-flex items-center gap-2"><PlusIcon className="h-4 w-4" /> Add category</button>
          </Tooltip>
        </div>
      </div>
      {categories.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">No categories yet.</p>
          <Tooltip label="Add category">
            <button onClick={() => setModal({ open: true, kind: 'add', name: '', newName: '' })} className="btn-primary inline-flex items-center gap-2"><PlusIcon className="h-4 w-4" /> Add your first category</button>
          </Tooltip>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div key={c} className={`flex items-center gap-1 rounded-full border px-1.5 py-1 ${selectedLower === c.toLowerCase() ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-900' : 'border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200'}`}>
              <button onClick={() => { const next = new URLSearchParams(params); next.set('cat', c); setParams(next, { replace: true }); }} className="px-2 text-sm hover:underline dark:hover:text-blue-300">{c}</button>
              <Tooltip label="Rename">
                <button onClick={() => setModal({ open: true, kind: 'rename', name: c, newName: c })} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800" aria-label="Rename">
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
              </Tooltip>
              <Tooltip label="Delete">
                <button onClick={() => setModal({ open: true, kind: 'delete', name: c })} className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700" aria-label="Delete">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
          ))}
          <button onClick={() => setModal({ open: true, kind: 'add', name: '', newName: '' })} className="btn-primary inline-flex items-center gap-2"><PlusIcon className="h-4 w-4" /> Add category</button>
          {/* Removed global selected-category controls to avoid duplicate edit/delete; controls live on each chip */}
        </div>
      )}
      {selectedCategory && (
        <div className="space-y-4">
          {inCategory.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No posts in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inCategory.map((p) => (
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
                  onDelete={() => setConfirmPost({ open: true, id: p.id })}
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
        </div>
      )}

      <Modal
        open={modal.open}
        title={modal.kind === 'add' ? 'Add category' : modal.kind === 'rename' ? 'Rename category' : 'Delete category?'}
        onClose={() => setModal({ open: false, kind: 'add', name: '', newName: '' })}
        onConfirm={() => {
          if (modal.kind === 'add') {
            const added = addCategory(modal.newName);
            if (added) show('Category added', 'success');
          } else if (modal.kind === 'rename') {
            if (modal.newName.trim() === modal.name.trim()) {
              // no change; keep current selection and do nothing
              show('No changes made', 'info');
            } else {
              const res = renameCategory(modal.name, modal.newName);
              if (res) {
                renameCategoryInPosts(res.oldName, res.newName);
                const next = new URLSearchParams(params); next.set('cat', res.newName); setParams(next, { replace: true });
                show('Category renamed', 'success');
              }
            }
          } else if (modal.kind === 'delete') {
            deleteCategory(modal.name);
            clearCategoryInPosts(modal.name);
            const next = new URLSearchParams(params); next.delete('cat'); setParams(next, { replace: true });
            show('Category deleted', 'success');
          }
          setModal({ open: false, kind: 'add', name: '', newName: '' });
        }}
        confirmText={modal.kind === 'delete' ? 'Delete' : 'Save'}
      >
        {modal.kind === 'delete' ? (
          <p>Removing this category will not delete posts; their category will be cleared.</p>
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Name</label>
            <input value={modal.newName} onChange={(e) => setModal((m) => ({ ...m, newName: e.target.value }))} className="input" placeholder="e.g. tutorials" />
          </div>
        )}
      </Modal>

      {/* Post delete confirm modal */}
      <Modal
        open={confirmPost.open}
        title="Delete post?"
        onClose={() => setConfirmPost({ open: false, id: null })}
        onConfirm={() => {
          if (confirmPost.id) {
            deletePost(confirmPost.id);
          }
          setConfirmPost({ open: false, id: null });
          show('Post deleted', 'success');
        }}
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
      </Modal>
    </section>
  );
}


