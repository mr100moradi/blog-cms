export default function Tooltip({ label, position = 'top', children }) {
  const pos = position === 'bottom'
    ? 'top-full mt-2 left-1/2 -translate-x-1/2'
    : position === 'left'
      ? 'right-full mr-2 top-1/2 -translate-y-1/2'
      : position === 'right'
        ? 'left-full ml-2 top-1/2 -translate-y-1/2'
        : 'bottom-full mb-2 left-1/2 -translate-x-1/2'; // top
  return (
    <span className="relative inline-flex">
      <span className="peer inline-flex">{children}</span>
      <span className={`pointer-events-none invisible absolute whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition peer-hover:visible peer-hover:opacity-100 ${pos}`}>{label}</span>
    </span>
  );
}


