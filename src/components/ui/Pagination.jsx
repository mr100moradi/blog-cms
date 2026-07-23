export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button disabled={!canPrev} onClick={() => onPageChange(page - 1)} className={`btn-outline ${!canPrev ? 'opacity-50 cursor-not-allowed' : ''}`}>Prev</button>
      <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
      <button disabled={!canNext} onClick={() => onPageChange(page + 1)} className={`btn-outline ${!canNext ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
    </div>
  );
}


