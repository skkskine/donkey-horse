import type { Invitation } from "../types/invite";
import { authenticatedFetch, notAuthenticatedFetch } from "./methods";

export const checkIfInvitationidIsCorrect = async (
  id: string
): Promise<{ valid: boolean }> => {
  const res = await notAuthenticatedFetch(`invite/${id}`);
  return res.json();
};

export const createInvitationid = async (): Promise<{ item: Invitation }> => {
  const res = await authenticatedFetch(`invite`, { method: "POST" });
  return res.json();
};
