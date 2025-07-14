export default function SkeletonLoader({ route }) {
  const baseClass = 'bg-gray-300 dark:bg-gray-700 rounded';

  if (route.includes('inventory')) {
    return (
       <div className="animate-pulse">
        <div className={`h-10 w-full mb-4 ${baseClass}`} />
        <div className={`h-64 w-full ${baseClass}`} />
    </div>
    );
  }

  if (route.includes('dashboard')) {
    return (
      <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-24 ${baseClass}`} />
        ))}
        <div className={`h-64 col-span-2 ${baseClass}`} />
      </div>
    );
  }

  if (route.includes('pos')) {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
       
        <div className={`md:col-span-2 h-48 ${baseClass}`}></div>
        <div className={`h-48 ${baseClass}`}></div>
      </div>
    );
  }

  // Default fallback skeleton
  return (
    <div className="animate-pulse">
      <div className={`h-10 w-full mb-4 ${baseClass}`} />
      <div className={`h-64 w-full ${baseClass}`} />
    </div>
  );
}
