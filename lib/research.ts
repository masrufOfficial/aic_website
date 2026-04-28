import { titleCase } from "@/lib/utils";

export const RESEARCH_STATUSES = ["pending", "approved", "rejected"] as const;

export type ResearchStatus = (typeof RESEARCH_STATUSES)[number];

export function normalizeResearchTags(input: string[]) {
  return Array.from(
    new Set(
      input
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 12)
    )
  );
}

export function getResearchStatusVariant(status: string) {
  switch (status) {
    case "approved":
      return "success" as const;
    case "rejected":
      return "danger" as const;
    case "pending":
    default:
      return "warning" as const;
  }
}

export function getResearchStatusLabel(status: string) {
  return titleCase(status);
}

export function summarizeResearchContent(content: string, maxLength = 180) {
  const collapsed = content.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLength) {
    return collapsed;
  }

  return `${collapsed.slice(0, maxLength).trimEnd()}...`;
}
