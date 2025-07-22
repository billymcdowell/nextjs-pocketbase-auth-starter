"use client";

import { useRealtime } from "@/hooks/use-sse";
import { makeRequest } from "@/lib/pocketbase";
import React from "react";


export default function DashboardPage() {

  const { data, error } = useRealtime('users');

  const handleCreateData = async () => {
    try {
      const res = await makeRequest('test/records', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test',
        }),
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground text-lg">This is your dashboard. More features coming soon!</p>

      {data ? (
        <pre className="p-2 rounded text-xs w-full max-w-xl overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>No data</p>
      )}

      {error && (
        <p>Error: {error}</p>
      )}

      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <button onClick={handleCreateData} className="bg-blue-500 text-white px-4 py-2 rounded-md">Create Data</button>
      </div>
    </div>
  );
}
