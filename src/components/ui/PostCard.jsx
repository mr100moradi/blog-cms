import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

export default function PostCard({ title, excerpt, date, tags = [], category = '', image = '', imgUrl = '', onClick, onTagClick, onCategoryClick, onEdit, onDelete }) {
  return (
    <article onClick={onClick} className="group cursor-pointer card transition hover:-translate-y-0.5 hover:shadow-md">
      {(image || imgUrl) && (
        <div className="mb-3 overflow-hidden rounded-md origin-center transition-transform duration-300 hover:rotate-[2.5deg]">
          <img src={image || imgUrl} alt="cover" className="h-40 w-full object-cover" />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 text-base font-semibold group-hover:text-blue-600">{title}</h3>
        {(onEdit || onDelete) && (
          <div className="shrink-0 flex items-center gap-1.5">
            {onEdit && (
              <Tooltip label="Edit">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  aria-label="Edit"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip label="Delete">
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700"
                  aria-label="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
          </div>
        )}
      </div>
      {excerpt && <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{excerpt}</p>}
      {category && (
        <div className="mt-3">
          <button onClick={(e) => { e.stopPropagation(); onCategoryClick?.(category); }} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">{category}</button>
        </div>
      )}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button key={t} onClick={(e) => { e.stopPropagation(); onTagClick?.(t); }} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">#{t}</button>
          ))}
        </div>
      )}
      {date && <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">{date}</p>}
    </article>
  );
}


