import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemsEditor } from "@/features/admin/items-editor";
import { listCategories } from "@/features/admin/queries/categories";
import { listEditableItems } from "@/features/admin/queries/items";

/**
 * The editor reads the database uncached, so the section sits behind a
 * Suspense boundary and the shell around it still prerenders.
 */
async function Items() {
  const [items, categories] = await Promise.all([
    listEditableItems(),
    listCategories(),
  ]);

  return <ItemsEditor categories={categories} items={items} />;
}

function Loading() {
  return (
    <div className="grid gap-3">
      <Skeleton className="h-9 w-full max-w-xs" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Items />
    </Suspense>
  );
}
