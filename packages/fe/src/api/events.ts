import type { Event, EventData } from "../types/events";
import { authenticatedFetch, notAuthenticatedFetch } from "./methods";

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
