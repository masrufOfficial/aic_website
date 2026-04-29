import { MembershipStatus, UserRole } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const membershipSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.email(),
  phone: z.string().min(8).max(30),
  membershipId: z.string().min(3).max(40),
});

export const eventSchema = z.object({
  title: z.string().min(3).max(120),
  type: z.enum(["national", "domestic", "collaborative", "industrial_visit"]),
  date: z.string().min(1),
  description: z.string().min(10),
  location: z.string().min(3),
  registrationLink: z.url().optional().or(z.literal("")),
  coverImage: z.url().optional().or(z.literal("")),
});

export const gallerySchema = z.object({
  eventId: z.string().min(1),
  imageUrl: z.url(),
  caption: z.string().max(140).optional(),
});

export const researchStatusSchema = z.enum(["pending", "approved", "rejected"]);

const optionalUrlField = z.url().optional().or(z.literal(""));

export const researchCreateSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(20).max(320),
  content: z.string().min(40),
  githubUrl: optionalUrlField,
  paperUrl: optionalUrlField,
  demoUrl: optionalUrlField,
  images: z.array(z.url()).max(12).default([]),
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
});

export const researchStatusUpdateSchema = z.object({
  status: researchStatusSchema,
});

export const committeeSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  image: z.url(),
  group: z.enum(["president", "executive", "moderator", "alumni"]).optional(),
  isAlumni: z.boolean().optional(),
  userId: z.string().optional().or(z.literal("")),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  email: z.email().optional(),
  image: z.url().optional().or(z.literal("")),
  profileImage: z.url().optional().or(z.literal("")),
  role: z.nativeEnum(UserRole).optional(),
  emailVerified: z.boolean().optional(),
  membershipStatus: z.nativeEnum(MembershipStatus).optional(),
  membershipExpiry: z.string().datetime().optional().or(z.literal("")),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number"),
});

export const executiveApplicationSchema = z.object({
  fullName: z.string().min(2).max(100),
  cvUrl: z.url(),
  skills: z.string().min(10).max(1200),
  motivation: z.string().min(20).max(2000),
});

export const executiveApplicationReviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export const contentUpdateSchema = z.object({
  club_name: z.string().min(2).max(80),
  logo_url: z.string().optional(),
  logo_size: z.enum(["small", "medium", "large"]),
  logo_style: z.enum(["rounded", "square", "pill"]),
  logo_fit_mode: z.enum(["cover", "contain"]),
  logo_crop: z.enum(["square", "center"]),
  image_ratio: z.enum(["1:1", "4:3", "16:9"]),
  image_fit: z.enum(["cover", "contain"]),
  image_style: z.enum(["rounded", "square"]),
  hero_badge: z.string().min(2).max(120),
  hero_title: z.string().min(3).max(160),
  hero_subtitle: z.string().min(10).max(320),
  hero_image_url: z.url(),
  vision_mission: z.string().min(10).max(1000),
  about_text: z.string().min(10).max(1200),
});
