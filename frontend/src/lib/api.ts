function getApiBase(): string {
  const envApi = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    if (!envApi || envApi.includes("localhost")) {
      const hostname = window.location.hostname;
      if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
        return `http://${hostname}:5000/api`;
      }
    }
  }
  return envApi || "http://localhost:5000/api";
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const base = getApiBase();
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data as T;
}
export const money = (amount: number) =>
  `৳ ${Number(amount || 0).toLocaleString("en-BD")}`;
