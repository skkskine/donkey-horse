import type {
  LoginCredentials,
  RegisterData,
  RegisterWithCodeData,
  UpdatePasswordData,
} from "../types/auth";
import { authenticatedFetch, notAuthenticatedFetch } from "./methods";

export async function login(credentials: LoginCredentials) {
  try {
    const response = await notAuthenticatedFetch(`auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "login error");
    }

    return response.json();
  } catch {
    throw new Error("credentials are not valid");
  }
}

export async function register(data: RegisterData) {
  const response = await authenticatedFetch(`auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "regstration error");
  }

  return response.json();
}

export async function registerWithCode(data: RegisterWithCodeData) {
  const response = await notAuthenticatedFetch(`auth/register-with-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "regstration error");
  }

  return response.json();
}

export async function updatePassword(data: UpdatePasswordData) {
  const response = await authenticatedFetch(`auth/update-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "update password error");
  }

  return response.json();
}

export async function getCurrentUser(token: string) {
  const response = await authenticatedFetch(`auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("token is not valid");
  }

  return response.json();
}
