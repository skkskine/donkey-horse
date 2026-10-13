const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// reads the error message sent by the backend, falling back to the http status
async function responseError(response: Response) {
  const body = await response.json().catch(() => ({}));
  return new Error(body.error || body.message || response.statusText);
}

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
    throw await responseError(response);
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
    throw await responseError(response);
  }

  return response;
}
