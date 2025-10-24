import type { Event, EventData } from "../types/events";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function get(url: string) {
  return await fetch(`${API_BASE_URL}/api/${url}`);
}

async function post(url: string, body: unknown) {
  return await fetch(`${API_BASE_URL}/api/${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function put(url: string, body: unknown) {
  return await fetch(`${API_BASE_URL}/api/${url}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Non autenticato");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token scaduto, fai logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error(`Errore: ${response.statusText}`);
  }

  return response.json();
}

// API

export const getEvents = async (): Promise<{ items: EventData[] }> => {
  const res = await get("events");
  return res.json();
};

export const getEvent = async (
  id: string
): Promise<{ item: EventData | null }> => {
  const res = await get(`event/${id}`);
  return res.json();
};

export const addEvent = async (event: Event): Promise<Event> => {
  const res = await post("events", event);
  return res.json();
};

export const updateEvent = async ({
  id,
  event,
}: {
  id: string;
  event: Event;
}): Promise<{ item: EventData }> => {
  const res = await put(`event/${id}`, event);
  return res.json();
};
