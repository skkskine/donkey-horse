import type { Event } from "../../types/events";

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

// API

export const addEvent = async (event: Event): Promise<Event> => {
  const res = await post("events", event);
  return res.json();
};
