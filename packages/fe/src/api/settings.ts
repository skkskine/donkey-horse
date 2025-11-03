import type Settings from "../types/settings";
import { authenticatedFetch } from "./methods";

export const getSettings = async (): Promise<Settings> => {
  const res = await authenticatedFetch("settings");
  return res.json();
};
