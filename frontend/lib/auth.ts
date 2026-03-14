import api from "./api";

export async function login(password: string): Promise<string> {
  const response = await api.post("/api/v1/auth/login", { password });
  const token = response.data.data.access_token;
  if (typeof window !== "undefined") {
    (window as any).__accessToken = token;
  }
  return token;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/v1/auth/logout");
  } finally {
    if (typeof window !== "undefined") {
      (window as any).__accessToken = null;
    }
    window.location.href = "/login";
  }
}

export async function silentRefresh(): Promise<string | null> {
  try {
    const response = await api.post("/api/v1/auth/refresh");
    const token = response.data.data.access_token;
    if (typeof window !== "undefined") {
      (window as any).__accessToken = token;
    }
    return token;
  } catch {
    return null;
  }
}
