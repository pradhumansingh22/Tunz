import { StreamView } from "@/app/components/StreamView";

interface PageProps {
  params: Promise<{ creatorId: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: Promise<Record<string, any>>;
}

export default async function CreatorPage({ params }: PageProps) {
  const resolvedParams = await params; // ✅ Await the params

  return (
    <div>
      <StreamView creatorId={resolvedParams.creatorId} />
    </div>
  );
}
