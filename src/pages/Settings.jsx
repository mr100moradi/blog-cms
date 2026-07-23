import { usePosts } from '../data/PostContext';
import { useToast } from '../components/ui/ToastProvider';

export default function Settings() {
  const { posts, replaceAllPosts } = usePosts();
  const { show } = useToast();

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-posts.json';
    a.click();
    URL.revokeObjectURL(url);
    show('Exported as JSON', 'success');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('Invalid JSON');
      replaceAllPosts(data);
      show('Imported successfully', 'success');
    } catch (err) {
      show('Import failed: invalid JSON', 'error');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-gray-600">Export or import your data.</p>
      </div>
      <div className="card flex flex-wrap items-center gap-3">
        <button onClick={handleExport} className="btn-primary">Export JSON</button>
        <label className="btn-outline cursor-pointer">
          Import JSON
          <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
        </label>
      </div>
    </section>
  );
}


