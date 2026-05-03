export function getImageUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL + "/uploads" + path;
}
