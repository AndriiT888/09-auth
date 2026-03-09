import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteHub | Sign Up",
  description: "Create a new NoteHub account.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}