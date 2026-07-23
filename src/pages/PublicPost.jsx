import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { usePosts } from '../data/PostContext';
import { useState } from 'react';

export default function PublicPost() {
  const { id } = useParams();
  const { getPost, addComment } = usePosts();
  const post = getPost(id);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  if (!post || (post.status || 'published') !== 'published') {
    return <p className="text-sm text-gray-600">Post not found.</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment(id, { author, content });
    setContent('');
  };

  return (
    <article className="space-y-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        {post.category && <p className="mt-1 text-xs text-gray-500">Category: {post.category}</p>}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600">#{t}</span>
            ))}
          </div>
        )}
        <div className="prose prose-sm mt-6 max-w-none dark:prose-invert">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      <section className="card p-6">
        <h2 className="text-lg font-semibold">Comments</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900" placeholder="Your name (optional)" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Your comment</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} required className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900" placeholder="Write your comment" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">Submit comment</button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {(post?.comments || []).length === 0 ? (
            <p className="text-sm text-gray-600">No comments yet.</p>
          ) : (
            (post.comments || []).map((c) => (
              <div key={c.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{c.author || 'Anonymous'}</span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">{c.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}


