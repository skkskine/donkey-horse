const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getEventsList = async () => {
  const res = await fetch(`${API_BASE_URL}/getEventsList`);
  return res.json();
};
