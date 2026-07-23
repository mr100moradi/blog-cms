import PostForm from '../components/ui/PostForm';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../data/PostContext';
import { useMemo } from 'react';
import { useToast } from '../components/ui/ToastProvider';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPost, editPost } = usePosts();
  const { show } = useToast();
  const post = getPost(id);
  const initialData = useMemo(() => (
    post
      ? { title: post.title, content: post.content, tags: post.tags, category: post.category || '', status: post.status || 'published' }
      : { title: '', content: '', tags: '', category: '', status: 'published' }
  ), [post]);
  if (!post) return <p className="text-sm text-gray-600">Post not found.</p>;
  const handleSubmit = (data) => {
    editPost(id, data);
    show('Post updated', 'success');
    navigate('/admin');
  };
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white">Edit post</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Apply your changes.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <PostForm mode="edit" initial={initialData} onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
      </div>
    </section>
  );
}


