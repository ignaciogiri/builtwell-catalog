import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesEditor } from "@/features/admin/categories-editor";
import { listCategories } from "@/features/admin/queries/categories";

async function Categories() {
  return <CategoriesEditor categories={await listCategories()} />;
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <Categories />
    </Suspense>
  );
}
