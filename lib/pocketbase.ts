import { getAuthToken } from "@/actions/auth";

export const POCKETBASE_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";

export async function pbFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${POCKETBASE_URL}/api/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res as unknown as T;
}

// Helper function to make API requests
export async function makeRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${POCKETBASE_URL}/api/collections/${endpoint}`


  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if(response.body == null || response.body == undefined) {
    return {
      status: response.status,
      message: 'No response body',
    }
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return { ...data, status: response.status }
}

export async function makeRequestWithAuth(endpoint: string, options: RequestInit = {}) {
  const authToken = await getAuthToken();
  return pbFetch(endpoint, {
    ...options,
    headers: {
      ...(authToken ? { Authorization: authToken } : {}),
    },
  });
}