import { cn } from "@/lib/utils";

type ImageDisplayProps = {
  src: string;
  alt: string;
  aspectRatio?: "16:9" | "1:1" | "4:3";
  fit?: "cover" | "contain";
  rounded?: boolean;
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
};

const aspectMap = {
  "16:9": "aspect-[16/9]",
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
};

export function ImageDisplay({
  src,
  alt,
  aspectRatio = "4:3",
  fit = "cover",
  rounded = true,
  className,
  imageClassName,
  overlayClassName,
  children,
}: ImageDisplayProps) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-slate-100", aspectMap[aspectRatio], rounded ? "rounded-3xl" : "rounded-none", className)}>
      <img
        alt={alt}
        decoding="async"
        className={cn("h-full w-full transition duration-300", fit === "cover" ? "object-cover" : "object-contain", imageClassName)}
        loading="lazy"
        src={src}
      />
      {children ? <div className={cn("absolute inset-0", overlayClassName)}>{children}</div> : null}
    </div>
  );
}
