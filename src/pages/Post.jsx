import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePosts } from '../data/PostContext';
import Modal from '../components/ui/Modal';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '../components/ui/ToastProvider';

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPost, deletePost, addComment, deleteComment } = usePosts();
  const post = getPost(id);
  const [open, setOpen] = useState(false);
  const { show } = useToast();
  const [author, setAuthor] = useState('Admin');
  const [comment, setComment] = useState('');
  if (!post) return <p className="text-sm text-gray-600">Post not found.</p>;
  const handleDelete = () => {
    deletePost(id);
    show('Post deleted', 'success');
    navigate('/admin');
  };
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(id, { author, content: comment });
    setComment('');
    show('Comment added', 'success');
  };
  return (
    <article className="space-y-8">
      <div className="card p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{post.title}</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
          {(post.image || post.imgUrl) && (
            <div className="mt-3 overflow-hidden rounded-md">
              <img src={post.image || post.imgUrl} alt="cover" className="max-h-72 w-full object-cover" />
            </div>
          )}
          {post.category && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Category: {post.category}</p>
          )}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">#{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/admin/edit/${post.id}`} className="btn-outline">Edit</Link>
          <button onClick={() => setOpen(true)} className="btn-primary bg-red-600 hover:bg-red-700">Delete</button>
        </div>
      </div>
      <div className="prose prose-sm mt-6 max-w-none dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-strong:text-gray-200 dark:prose-code:text-gray-200">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} onConfirm={handleDelete} title="Delete post?">
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
      </Modal>
      </div>

      <section className="card p-6">
        <h2 className="text-lg font-semibold">Comments</h2>
        <form onSubmit={handleAddComment} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="input" placeholder="Author" />
          <input value={comment} onChange={(e) => setComment(e.target.value)} className="input sm:col-span-2" placeholder="Write a comment..." />
          <div className="sm:col-span-3">
            <button type="submit" className="btn-primary">Add comment</button>
          </div>
        </form>
        <div className="mt-4 space-y-4">
          {(post.comments || []).length === 0 ? (
            <p className="text-sm text-gray-600">No comments yet.</p>
          ) : (
            (post.comments || []).map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{c.author || 'Anonymous'}</span>
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{c.content}</p>
                </div>
                <button
                  className="btn-outline text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => deleteComment(id, c.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}


