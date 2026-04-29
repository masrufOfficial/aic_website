"use client";

import { useState } from "react";
import { ImagePlus, LoaderCircle, Link2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { getMembershipBadgeVariant } from "@/lib/membership";
import { formatDate, titleCase } from "@/lib/utils";

type MembershipSummary = {
  membershipId: string;
  status: "inactive" | "pending" | "active" | "expired" | "rejected";
  expiresAt: string | Date | null;
  approvedAt: string | Date | null;
};

export function ProfileSettings({
  user,
  latestMembership,
}: {
  user: {
    name: string;
    email: string;
    image: string | null;
    profileImage: string | null;
    membershipStatus: MembershipSummary["status"];
    emailVerified: boolean;
  };
  latestMembership: MembershipSummary | null;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const initialImage = user.image ?? user.profileImage ?? "";
  const [profileImage, setProfileImage] = useState(initialImage);
  const [imageUrlInput, setImageUrlInput] = useState(initialImage);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleProfileSave() {
    setSavingProfile(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, profileImage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update profile.");
      }

      setMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSave() {
    setSavingPassword(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password changed successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to change password.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    setUploadingImage(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("folder", "profiles");
      formData.append("files", files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to upload image.");
      }

      setProfileImage(data.file.url);
      setImageUrlInput(data.file.url);
      setMessage("Profile image uploaded. Save profile to keep the change.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setUploadingImage(false);
    }
  }

  function handleImageUrlApply() {
    setError(null);
    setMessage(null);

    const normalized = imageUrlInput.trim();
    if (!normalized) {
      setProfileImage("");
      setMessage("Profile image cleared. Save profile to keep the change.");
      return;
    }

    try {
      const parsed = new URL(normalized);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Only http and https image URLs are allowed.");
      }

      setProfileImage(normalized);
      setMessage("External image URL applied. Save profile to keep the change.");
    } catch {
      setError("Please enter a valid image URL.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="border-slate-200/80 bg-white/85">
        <CardHeader>
          <CardTitle>Member Snapshot</CardTitle>
          <CardDescription>Your current account and membership status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-[var(--denim-50)] shadow-lg">
              {profileImage ? (
                <img alt={name} className="h-full w-full object-cover" src={profileImage} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-[var(--denim-700)]">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-950">{name}</p>
            <p className="text-sm text-slate-500">{email}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--denim-600)]">
              {user.emailVerified ? "Verified account" : "Pending email verification"}
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Membership:</span>
              <Badge variant={getMembershipBadgeVariant(user.membershipStatus)}>{titleCase(user.membershipStatus)}</Badge>
            </div>
            <p><span className="font-semibold text-slate-900">Membership ID:</span> {latestMembership?.membershipId ?? "Not assigned"}</p>
            <p><span className="font-semibold text-slate-900">Expiry:</span> {latestMembership?.expiresAt ? formatDate(latestMembership.expiresAt) : "Not available"}</p>
            <p><span className="font-semibold text-slate-900">Approved:</span> {latestMembership?.approvedAt ? formatDate(latestMembership.approvedAt) : "Awaiting approval"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-slate-200/80 bg-white/85">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your account details and choose a profile image by upload or URL.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <Input onChange={(event) => setName(event.target.value)} value={name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">External Image URL</label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2">
                  <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    onChange={(event) => setImageUrlInput(event.target.value)}
                    placeholder="Paste image URL"
                    type="text"
                    value={imageUrlInput}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={handleImageUrlApply} type="button" variant="outline">
                  Apply URL
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-[var(--denim-300)] bg-[var(--denim-50)]/70 p-4">
              {uploadingImage ? (
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--denim-700)]">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Uploading profile image...
                </div>
              ) : (
                <FileDropzone
                  accept="image/*"
                  description="Drop an image here or click to upload. Uploaded files preview immediately."
                  label="Upload profile image"
                  onFilesSelected={handleImageUpload}
                />
              )}
            </div>

            {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <Button disabled={savingProfile} onClick={handleProfileSave} type="button">
              {savingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/85">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password using your current credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Current Password</label>
                <PasswordInput onChange={(event) => setCurrentPassword(event.target.value)} value={currentPassword} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">New Password</label>
                <PasswordInput onChange={(event) => setNewPassword(event.target.value)} value={newPassword} />
              </div>
            </div>

            <Button disabled={savingPassword} onClick={handlePasswordSave} type="button" variant="outline">
              {savingPassword ? "Updating..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/85">
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>Use this preview to confirm your avatar before saving.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-3xl bg-[var(--denim-50)]">
              {profileImage ? (
                <img alt={`${name} profile preview`} className="h-72 w-full object-cover" src={profileImage} />
              ) : (
                <div className="flex h-72 w-full flex-col items-center justify-center gap-3 text-slate-500">
                  <ImagePlus className="h-8 w-8" />
                  <p className="text-sm">No profile image selected yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
