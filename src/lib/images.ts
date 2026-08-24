import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpeg,jpg,png,svg,webp}');

export async function getImage(imageId: string): Promise<ImageMetadata | null> {
  const matchingPath = Object.keys(images).find(path => path.includes(`/${imageId}.`));
  if (!matchingPath) return null;
  return (await images[matchingPath]()).default;
}
