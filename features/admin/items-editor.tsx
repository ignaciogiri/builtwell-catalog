"use client";

import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ItemForm } from "./item-form";
import type { AdminCategory } from "./queries/categories";
import type { EditableItem } from "./queries/items";

/**
 * The item table, editing in place.
 *
 * One dialog is mounted for the whole table rather than one per row: the rows
 * only set which item is open, so a catalog of any size costs a single popup.
 */
export function ItemsEditor({
  categories,
  items,
}: {
  categories: AdminCategory[];
  items: EditableItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditableItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");

  const open = editing !== null || creating;

  const close = useCallback(() => {
    setEditing(null);
    setCreating(false);
  }, []);

  // The table is read uncached on the server, so a refresh is what shows the
  // save. The dialog closes first so the row updates behind an empty overlay.
  const onSaved = useCallback(() => {
    close();
    router.refresh();
  }, [close, router]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return items;
    }
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search items"
            className="pl-8"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, category or tag"
            value={query}
          />
        </div>

        <Button onClick={() => setCreating(true)} type="button">
          <Plus data-icon="inline-start" />
          New item
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Tags</TableHead>
              <TableHead className="hidden md:table-cell">Added</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {shown.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={4}
                >
                  {items.length === 0
                    ? "No items yet."
                    : "Nothing matches that search."}
                </TableCell>
              </TableRow>
            ) : (
              shown.map((item) => (
                <TableRow
                  className="cursor-pointer"
                  key={item.id}
                  onClick={() => setEditing(item)}
                >
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      {item.name}
                      {item.badge ? (
                        <Badge variant="secondary">{item.badge}</Badge>
                      ) : null}
                    </span>
                  </TableCell>

                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {item.categoryName}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <span className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 ? (
                        <Badge variant="outline">+{item.tags.length - 3}</Badge>
                      ) : null}
                    </span>
                  </TableCell>

                  <TableCell className="hidden text-muted-foreground tabular-nums md:table-cell">
                    {formatDate(item.dateAdded)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground text-xs">
        {shown.length} of {items.length} item{items.length === 1 ? "" : "s"}
      </p>

      <Dialog onOpenChange={(next) => !next && close()} open={open}>
        <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? editing.name : "New item"}</DialogTitle>
            <DialogDescription>
              {editing
                ? `In ${editing.categoryName}. Saving updates the catalog straight away.`
                : "Everything but the name and category is optional."}
            </DialogDescription>
          </DialogHeader>

          {/* Keyed so switching rows resets every uncontrolled field. */}
          <ItemForm
            categories={categories}
            item={editing ?? undefined}
            key={editing?.id ?? "new"}
            onSaved={onSaved}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
