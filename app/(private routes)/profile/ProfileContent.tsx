"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./ProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { getMe } from "@/lib/api/clientApi";

const DEFAULT_AVATAR = "https://ac.goit.global/fullstack/react/avatar.png";

export default function ProfileContent() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (!user) {
          const fetchedUser = await getMe();
          setUser(fetchedUser);
        }
      } catch {
        router.replace("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, setUser, router]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <button
            onClick={() => router.push("/profile/edit")}
            className={css.editProfileButton}
          >
            Edit Profile
          </button>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? DEFAULT_AVATAR}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p className={css.usernameWrapper}>
            Username: {user.username ?? user.username ?? "No username"}
          </p>
          <p>Email: {user.email ?? "No email"}</p>
        </div>
      </div>
    </main>
  );
}