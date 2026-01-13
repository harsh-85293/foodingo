// Shimmer.jsx
const Shimmer = ({ count = 12 }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
      aria-busy="true"
      aria-label="Loading cards"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="animate-pulse">
            <div className="h-40 w-full rounded-xl bg-gray-200" />
            <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
            <div className="mt-3 h-3 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shimmer;
