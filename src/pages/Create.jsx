import PostForm from '../components/ui/PostForm';
import { usePosts } from '../data/PostContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../components/ui/ToastProvider';

export default function Create() {
  const { addPost } = usePosts();
  const navigate = useNavigate();
  const { show } = useToast();
  const [params] = useSearchParams();
  const initialCategory = params.get('cat') || '';
  const handleSubmit = (data) => {
    const created = addPost(data);
    show('Post created', 'success');
    navigate('/admin');
  };
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white">Create new post</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Enter title, content and tags.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <PostForm mode="create" initial={{ category: initialCategory }} onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
      </div>
    </section>
  );
}


