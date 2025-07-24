"use client";

import { makeRequestWithAuth, POCKETBASE_URL } from "@/lib/pocketbase";
import { useEffect, useState } from "react";


export function useRealtime(collection: string, recordId?: string) {
  const [clientId, setClientId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (recordId) {
        try {
          const res = await makeRequestWithAuth(`collections/${collection}/records/${recordId}`, {
            method: 'GET',
          })
          const data = await (res as any).json();
          setData(data);
        } catch (error) {
          setError('Error fetching data: ' + error);
        }
      } else {
        try {
          const res = await makeRequestWithAuth(`collections/${collection}/records`, {
            method: 'GET',
          })
          const data = await (res as any).json();
          setData(data.items || []);
        } catch (error) {
          setError('Error fetching data: ' + error);
        }
      }
    }

    fetchData();

    // Create an EventSource to listen to SSE events
    const eventSource = new EventSource(POCKETBASE_URL + '/api/realtime');

    // Listen for the PB_CONNECT event (named event)
    eventSource.addEventListener('PB_CONNECT', (event) => {
      const data = JSON.parse(event.data);
      setClientId(data.clientId);
      setIsConnected(true);
    });

    if (recordId) {
      eventSource.addEventListener(`${collection}/${recordId}`, (event) => {
        const data = JSON.parse(event.data);
        setData((prevData: any) => {
          switch (data.action) {
            case 'delete':
              return null;
            default:
              return data.record;;
          }
        });
      });
    } else {
      eventSource.addEventListener(collection, (event) => {
      const data = JSON.parse(event.data);
      setData((prevData: any) => {
        switch (data.action) {
          case 'create':
            return [...prevData, data.record];
          case 'update':
            return prevData.map((item: any) => item.id === data.record.id ? data.record : item);
          case 'delete':
            return prevData.filter((item: any) => item.id !== data.record.id);
          default:
            return prevData;
        }
      });
      });
    }

    // Handle errors
    eventSource.onerror = () => {
      setError('Error connecting to SSE server.');
      eventSource.close();
    };
    // Cleanup on unmount
    setIsLoading(false);
    return () => {
      eventSource.close();
    };
  }, []);

  if (clientId && !isConnected) {
    makeRequestWithAuth('realtime', {
      method: 'POST',
      body: JSON.stringify({
        clientId: clientId,
        subscriptions: [`${collection}${recordId ? `/${recordId}` : ''}`],
      }),
    });
  }

  return {
    data,
    error,
    isConnected,
    isLoading,
  }
}
