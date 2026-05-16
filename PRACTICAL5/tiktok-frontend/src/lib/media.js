export const getMediaUrl = (url) => {
  if (!url) return null;
  // Supabase and other cloud URLs are already absolute
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const serverUrl = baseUrl.includes("/api")
    ? baseUrl.substring(0, baseUrl.indexOf("/api"))
    : baseUrl;

  return `${serverUrl}${url.startsWith("/") ? url : `/${url}`}`;
};
