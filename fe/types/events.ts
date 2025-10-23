import type { BaseEntity } from "./be";

export interface Event {
  name: string;
  venue: string;
  eventdate: string;
  link?: string;
}

export type EventData = Event & BaseEntity;
