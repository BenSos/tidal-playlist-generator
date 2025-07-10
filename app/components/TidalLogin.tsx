'use client';

import { useTidal } from '../hooks/useTidal';

export default function TidalLogin() {
  const { isAuthenticated, user, loading, error, login, logout } = useTidal();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {user.picture && (
              <img
                className="h-10 w-10 rounded-full"
                src={user.picture}
                alt={user.username}
              />
            )}
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Welcome, {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Disconnect Tidal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-blue-900">Connect to Tidal</h3>
          <p className="text-sm text-blue-700">
            Connect your Tidal account to create and manage playlists.
          </p>
        </div>
        <div className="ml-auto">
          <button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Connect Tidal
          </button>
        </div>
      </div>
    </div>
  );
} 