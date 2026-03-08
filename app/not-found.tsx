import css from "./NotFound.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteHub | 404 - Page not found",
  description: "The page you are looking for does not exist in NoteHub.",
  openGraph: {
    title: "NoteHub | 404 - Page not found",
    description: "The page you are looking for does not exist in NoteHub.",
    url: "https://notehub.com/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}