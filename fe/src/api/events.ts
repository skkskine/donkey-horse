import type { Event, EventData } from "../types/events";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// METHODS

async function notAuthenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Errore: ${response.statusText}`);
  }

  return response;
}

async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("you are not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
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

  return response;
}

// API

export const getEvents = async (): Promise<{ items: EventData[] }> => {
  const res = await notAuthenticatedFetch("events");
  return res.json();
};

export const getEvent = async (
  id: string
): Promise<{ item: EventData | null }> => {
  const res = await notAuthenticatedFetch(`event/${id}`);
  return res.json();
};

export const addEvent = async (event: Event): Promise<Event> => {
  const res = await authenticatedFetch("events", {
    body: JSON.stringify(event),
    method: "POST",
  });
  return res.json();
};

export const updateEvent = async ({
  id,
  event,
}: {
  id: string;
  event: Event;
}): Promise<{ item: EventData }> => {
  const res = await authenticatedFetch(`event/${id}`, {
    body: JSON.stringify(event),
    method: "PUT",
  });
  return res.json();
};

export const deleteEvent = async ({
  id,
}: {
  id: string;
}): Promise<{ item: EventData }> => {
  const res = await authenticatedFetch(`event/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
