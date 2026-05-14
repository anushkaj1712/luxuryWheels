"use client";

import Image, { type ImageProps } from "next/image";
import * as React from "react";

type SafeImageProps = Omit<ImageProps, "onError" | "src"> & {
  src: string;
  /** Shown if the remote image fails (broken URL, CORS, etc.). */
  fallbackSrc?: string;
};

/**
 * Next/Image wrapper with error fallback and blur placeholder support for premium listings.
 * Prefer Cloudinary transforms in `src` for responsive delivery.
 */
export function SafeImage({ src, alt, fallbackSrc, className, ...rest }: SafeImageProps) {
  const [current, setCurrent] = React.useState(src);

  React.useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
