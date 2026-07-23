import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useCategories } from '../../data/CategoryContext';

export default function PostForm({ mode = 'create', initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    title: initial?.title || '',
    content: initial?.content || '',
    tags: Array.isArray(initial?.tags) ? initial.tags.join(', ') : (initial?.tags || ''),
    category: initial?.category || '',
    status: initial?.status || 'published',
    image: initial?.image || '',
  }));
  const { categories } = useCategories();
  const hydrated = useRef(false);

  // Hydrate once when initial becomes available (e.g., Edit page), without clobbering user edits
  useEffect(() => {
    if (initial && !hydrated.current) {
      setForm((prev) => ({
        ...prev,
        title: initial.title || '',
        content: initial.content || '',
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
        category: initial.category || '',
        status: initial.status || 'published',
        image: initial.image || '',
      }));
      hydrated.current = true;
    }
  }, [initial]);


  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input value={form.title} onChange={handleChange('title')} className="input" placeholder="e.g. My first post" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Content</label>
        <textarea value={form.content} onChange={handleChange('content')} rows={6} className="input" placeholder="Write your post..." />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Tags</label>
        <input value={form.tags} onChange={handleChange('tags')} className="input" placeholder="e.g. react, ui" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        {categories.length > 0 ? (
          <select value={form.category} onChange={handleChange('category')} className="input">
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        ) : (
          <>
            <input list="categories" value={form.category} onChange={handleChange('category')} className="input" placeholder="e.g. tutorials" />
            <datalist id="categories">
              {categories.map((c) => (<option key={c} value={c} />))}
            </datalist>
            <p className="mt-1 text-xs text-gray-500">Tip: add categories on the Categories page.</p>
          </>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>
        <select value={form.status} onChange={handleChange('status')} className="input">
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Cover image</label>
        <div className="flex items-center gap-2">
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const body = new FormData();
            body.append('image', file);
            const res = await fetch('/api/upload', { method: 'POST', body });
            const data = await res.json();
            if (data?.path) setForm((prev) => ({ ...prev, image: data.path }));
          }} className="block" />
          {form.image && <img src={form.image} alt="cover" className="h-10 w-16 rounded object-cover" />}
        </div>
        <p className="mt-1 text-xs text-gray-500">Upload an image; it will be stored under postImg.</p>
      </div>
      <details className="rounded-lg border border-gray-200 p-3 text-sm open:pb-4 dark:border-gray-800">
        <summary className="cursor-pointer select-none font-medium">Preview</summary>
        <div className="prose prose-sm mt-3 max-w-none dark:prose-invert">
          <ReactMarkdown>{form.content || '*Nothing to preview yet.*'}</ReactMarkdown>
        </div>
      </details>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
        <button type="submit" className="btn-primary">{mode === 'edit' ? 'Save changes' : 'Create post'}</button>
      </div>
    </form>
  );
}


