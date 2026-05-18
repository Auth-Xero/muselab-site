// utils/api.js

export const API_BASE = "https://api.muselab.app/api";

export function authHeader(token, withJson) {
  const t =
    token ||
    (typeof window !== "undefined" && localStorage.getItem("accessToken"));
  const headers = { Authorization: "Bearer " + t };
  if (withJson) headers["Content-Type"] = "application/json";
  return headers;
}

export async function apiRequest(
  path,
  { method = "GET", token, body, json = true } = {}
) {
  const sendJson = body != null && json;
  const res = await fetch(API_BASE + path, {
    method,
    headers: authHeader(token, sendJson),
    body: body == null ? undefined : sendJson ? JSON.stringify(body) : body,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
