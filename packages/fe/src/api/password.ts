import { notAuthenticatedFetch } from "./methods";

export const forgotPassword = async (
  email?: string
): Promise<{ valid: boolean }> => {
  if (!email) {
    throw new Error("email is needed");
  }
  const res = await notAuthenticatedFetch(`auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res.json();
};
