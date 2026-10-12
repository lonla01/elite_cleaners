import Image from "next/image";
import { images } from "@/content/images";
import type { ImageRef } from "@/content/schemas";
import { cn } from "@/lib/cn";

type Props = {
  image: ImageRef;
  sizes: string;
  className?: string;
  /** Use for the LCP image only. */
  preload?: boolean;
  fill?: boolean;
};

export function ContentImage({ image, sizes, className, preload, fill }: Props) {
  const { src, width, height } = images[image.key];
  return fill ? (
    <Image
      src={src}
      alt={image.alt}
      fill
      sizes={sizes}
      preload={preload}
      className={cn("object-cover", className)}
    />
  ) : (
    <Image
      src={src}
      alt={image.alt}
      width={width}
      height={height}
      sizes={sizes}
      preload={preload}
      className={cn("h-auto w-full object-cover", className)}
    />
  );
}
