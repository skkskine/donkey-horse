const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function notAuthenticatedFetch(
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

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
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
