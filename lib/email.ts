import crypto from "crypto";
import nodemailer from "nodemailer";

import { prisma } from "@/lib/prisma";

const DEFAULT_SMTP_HOST = process.env.EMAIL_HOST || "smtp.hostinger.com";
const DEFAULT_SMTP_PORT = Number(process.env.EMAIL_PORT || 465);

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: DEFAULT_SMTP_HOST,
    port: DEFAULT_SMTP_PORT,
    secure: DEFAULT_SMTP_PORT === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function getFromAddress() {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER || "aicommunity@bubt.edu.bd";
}

function getAppUrl() {
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function renderEmailShell(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:32px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e2e8f0;">
        <p style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#2563eb;margin:0 0 16px;">BUBT AI Community</p>
        <h1 style="font-size:28px;line-height:1.2;color:#0f172a;margin:0 0 18px;">${title}</h1>
        <div style="font-size:15px;line-height:1.8;color:#475569;">${body}</div>
      </div>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`Email skipped for ${to}: transporter is not configured.`);
    return;
  }

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
  });
}

export async function createEmailVerificationToken(userId: string) {
  await prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function sendVerificationEmail({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token: string;
}) {
  const verifyUrl = `${getAppUrl()}/api/auth/verify-email?token=${token}`;

  const html = renderEmailShell(
    "Verify your email address",
    `
      <p>Hello ${name},</p>
      <p>Thanks for joining the BUBT AI Community. Please verify your email before logging in.</p>
      <p style="margin:24px 0;">
        <a href="${verifyUrl}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;display:inline-block;font-weight:600;">Verify Email</a>
      </p>
      <p>If the button does not work, open this link:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    `
  );

  await sendEmail(email, "Verify your BUBT AI Community account", html);
}

export async function sendMembershipApprovedEmail({
  email,
  name,
  membershipId,
  expiryDate,
}: {
  email: string;
  name: string;
  membershipId: string;
  expiryDate: Date | null;
}) {
  const html = renderEmailShell(
    "Membership approved",
    `
      <p>Hello ${name},</p>
      <p>Your BUBT AI Community membership has been approved.</p>
      <p><strong>Membership ID:</strong> ${membershipId}</p>
      <p><strong>Expiry date:</strong> ${expiryDate ? expiryDate.toLocaleDateString("en-US", { dateStyle: "long" }) : "Not set"}</p>
      <p>You can now access verified-member features across the platform.</p>
    `
  );

  await sendEmail(email, "Your membership has been approved", html);
}

export async function sendNewEventEmail({
  email,
  name,
  eventTitle,
  eventDate,
  eventLocation,
  eventDescription,
}: {
  email: string;
  name: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation: string;
  eventDescription: string;
}) {
  const html = renderEmailShell(
    "New event announced",
    `
      <p>Hello ${name},</p>
      <p>A new community event has been published.</p>
      <p><strong>Event:</strong> ${eventTitle}</p>
      <p><strong>Date:</strong> ${eventDate.toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</p>
      <p><strong>Location:</strong> ${eventLocation}</p>
      <p>${eventDescription}</p>
    `
  );

  await sendEmail(email, `New event: ${eventTitle}`, html);
}
