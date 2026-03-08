import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import HydrateClient from "@/components/HydrateClient/HydrateClient";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  const note = await fetchNoteById(id);

  const title = `NoteHub | ${note.title}`;
  const description =
    note.content?.slice(0, 160) || "Read full note details in NoteHub.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrateClient state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrateClient>
  );
}