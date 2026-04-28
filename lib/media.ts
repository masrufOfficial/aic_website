export function getLogoSizeClasses(size: string) {
  switch (size) {
    case "small":
      return "h-10 w-10 md:h-11 md:w-11";
    case "large":
      return "h-14 w-14 md:h-16 md:w-16";
    default:
      return "h-11 w-11 md:h-12 md:w-12";
  }
}

export function getLogoStyleClasses(style: string) {
  switch (style) {
    case "square":
      return "rounded-xl";
    case "pill":
      return "rounded-[1.5rem]";
    default:
      return "rounded-2xl";
  }
}

export function getObjectFitClass(mode: string) {
  return mode === "cover" ? "object-cover" : "object-contain";
}

export function getCropClass(crop: string) {
  return crop === "center" ? "aspect-[4/3]" : "aspect-square";
}

export function getAspectRatioValue(ratio: string) {
  if (ratio === "1:1" || ratio === "16:9" || ratio === "4:3") {
    return ratio;
  }

  return "4:3";
}

export function getRoundedValue(style: string) {
  return style !== "square";
}
