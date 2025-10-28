import type { BaseEntity } from "./be";

export interface Event {
  name: string;
  venue: string;
  eventdate: string;
  link?: string;
  city?: string;
  eventtime?: string;
}

export type EventData = Event & BaseEntity;
