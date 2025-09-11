export const publicId = (url: string) => {
  const match = url.match(/\/(indecovietnam\/[^.]+)/);
  const result = match ? match[1] : null;
  return result || "";
}