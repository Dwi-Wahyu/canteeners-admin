export function getImageUrl(avatar?: string): string {
  if (!avatar) {
    return "https://mwozu5eodkq4uc39.public.blob.vercel-storage.com/default-avatar.jpg";
  }

  return "https://mwozu5eodkq4uc39.public.blob.vercel-storage.com/" + avatar;
}
