import Cookies from "js-cookie";

export function getAuthToken(): string | null {
  // Try to get token from cookies
  const token = Cookies.get("token") || Cookies.get("auth-token");
  return token || null;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
