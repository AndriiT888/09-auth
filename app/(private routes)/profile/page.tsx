import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "NoteHub | Profile",
  description: "Manage your NoteHub profile, preferences, and account settings.",
  openGraph: {
    title: "NoteHub | Profile",
    description: "Manage your NoteHub profile, preferences, and account settings.",
    url: "https://notehub.com/profile",
    type: "website",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - Your personal note-taking hub",
      },
    ],
  },
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <div className={css.mainContent}>
      <div className={css.profileCard}>

        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>

          <Link
            href="/profile/edit"
            className={css.editProfileButton}
          >
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={`${user.username}'s avatar`}
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <strong>Username:</strong> {user.username}
          </div>

          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

      </div>
    </div>
  );
}