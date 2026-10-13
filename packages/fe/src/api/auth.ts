import type {
  LoginCredentials,
  RegisterData,
  RegisterWithCodeData,
  UpdatePasswordData,
} from "../types/auth";
import { authenticatedFetch, notAuthenticatedFetch } from "./methods";

export async function login(credentials: LoginCredentials) {
  const response = await notAuthenticatedFetch(`auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return response.json();
}

export async function register(data: RegisterData) {
  const response = await authenticatedFetch(`auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function registerWithCode(data: RegisterWithCodeData) {
  const response = await notAuthenticatedFetch(`auth/register-with-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function updatePassword(data: UpdatePasswordData) {
  const response = await notAuthenticatedFetch(`auth/update-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}

// uses notAuthenticatedFetch so an expired token doesn't redirect public pages to /login
export async function getCurrentUser(token: string) {
  const response = await notAuthenticatedFetch(`auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
