"use client";

import { useState, useEffect } from 'react';

export const EnvironmentDebug = () => {
  const [envInfo, setEnvInfo] = useState<{
    NODE_ENV: string;
    NEXT_PUBLIC_API_URL: string;
    BEARER_TOKEN_LENGTH: number;
    API_ACCESSIBLE: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        // Check if we can access the API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        let apiAccessible = false;
        
        if (apiUrl) {
          try {
            const response = await fetch(`${apiUrl}/home-page`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
                'Content-Type': 'application/json',
              },
            });
            apiAccessible = response.ok;
          } catch {
            apiAccessible = false;
          }
        }

        setEnvInfo({
          NODE_ENV: process.env.NODE_ENV || 'undefined',
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'undefined',
          BEARER_TOKEN_LENGTH: process.env.NEXT_PUBLIC_BEARER_TOKEN?.length || 0,
          API_ACCESSIBLE: apiAccessible,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    checkEnvironment();
  }, []);

  if (loading) {
    return <div className="p-4 bg-blue-50 border border-blue-200 rounded">Loading environment info...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">Error: {error}</div>;
  }

  if (!envInfo) {
    return <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">No environment info available</div>;
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded text-sm">
      <h3 className="font-semibold mb-2">Environment Debug Info</h3>
      <div className="space-y-1">
        <div><strong>NODE_ENV:</strong> {envInfo.NODE_ENV}</div>
        <div><strong>API_URL:</strong> {envInfo.NEXT_PUBLIC_API_URL ? '✅ Set' : '❌ Missing'}</div>
        <div><strong>Bearer Token:</strong> {envInfo.BEARER_TOKEN_LENGTH > 0 ? `✅ Set (${envInfo.BEARER_TOKEN_LENGTH} chars)` : '❌ Missing'}</div>
        <div><strong>API Accessible:</strong> {envInfo.API_ACCESSIBLE ? '✅ Yes' : '❌ No'}</div>
      </div>
    </div>
  );
};
