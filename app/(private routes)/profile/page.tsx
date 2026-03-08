import type { Metadata } from "next";
import ProfileContent from "./ProfileContent";

export const metadata: Metadata = {
  title: "NoteHub | Profile",
  description: "User profile page in NoteHub.",
  openGraph: {
    title: "NoteHub | Profile",
    description: "User profile page in NoteHub.",
    url: "https://notehub.com/profile",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function ProfilePage() {
  return <ProfileContent />;
}