import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TagsEditor } from "@/features/admin/tags-editor";
import { listTags } from "@/features/admin/queries/tags";

async function Tags() {
  return <TagsEditor tags={await listTags()} />;
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <Tags />
    </Suspense>
  );
}
