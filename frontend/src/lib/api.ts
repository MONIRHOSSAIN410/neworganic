const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API}${path}`, {
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
