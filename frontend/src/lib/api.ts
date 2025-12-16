const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

const requireApiKey = () => {
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_API_KEY is not configured");
  }
  return apiKey;
};

export async function fetchTransaction(id: string) {
  defaultHeaders["x-api-key"] = requireApiKey();
  const res = await fetch(`${baseUrl}/v1/transactions/${id}`, {
    headers: defaultHeaders,
    cache: "no-store",
  });
  if (!res.ok) throw new Error("ไม่พบรายการชำระเงิน");
  const data = await res.json();
  return data.data;
}

export async function checkPaid(id: string) {
  defaultHeaders["x-api-key"] = requireApiKey();
  const res = await fetch(`${baseUrl}/v1/transactions/${id}/isPaid`, {
    headers: defaultHeaders,
    cache: "no-store",
  });
  if (!res.ok) throw new Error("ไม่พบรายการชำระเงิน");
  const data = await res.json();
  return data.paid as boolean;
}
