export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-gray-300">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Go back home
        </a>
      </div>
    </div>
  );
} 