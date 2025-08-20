"use client";

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

export default function TestAPI() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("Testing API...");
        const result = await apiClient.get('/user/posts?page=1&per_page=6');
        console.log("API Result:", result);
        setResponse(result);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1>API Test Results</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}
