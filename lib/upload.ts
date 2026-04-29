import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export const allowedDocumentTypes = new Set(["application/pdf"]);
export const allowedUploadTypes = new Set([...allowedImageTypes, ...allowedDocumentTypes]);
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const allowedExtensionsByType: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "application/pdf": ["pdf"],
};

export async function saveUploadedFile(file: File, folder = "general") {
  if (!allowedUploadTypes.has(file.type)) {
    throw new Error("Unsupported file type.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("File size exceeds the 5MB limit.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const allowedExtensions = allowedExtensionsByType[file.type] || [];

  if (!allowedExtensions.includes(extension)) {
    throw new Error("File extension does not match the uploaded type.");
  }

  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "general";
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads", safeFolder);
  const filePath = path.join(uploadsDir, filename);

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(filePath, buffer);

  return `/uploads/${safeFolder}/${filename}`;
}

export function isImageUploadFolder(folder: string) {
  return ["events", "gallery", "profiles", "branding", "research"].includes(folder);
}

export function isDocumentUploadFolder(folder: string) {
  return ["executive-cv"].includes(folder);
}
