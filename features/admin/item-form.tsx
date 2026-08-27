"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { deleteItem, saveItem } from "./actions/items";
import { Field } from "./fields";
import { AdminForm } from "./form";
import type { AdminCategory } from "./queries/categories";
import { SubmitButton } from "./submit-button";

type ItemValues = {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  description: string | null;
  url: string | null;
  imageSourceUrl: string | null;
  imageBlobUrl: string | null;
  badge: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  dateAdded: Date | null;
  position: number;
  tags: string[];
};

/** yyyy-mm-dd, which is what a date input reads and writes. */
function dateValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function ItemForm({
  categories,
  item,
  onSaved,
}: {
  categories: AdminCategory[];
  item?: ItemValues;
  /** Fires after a save or delete lands, so the dialog can close. */
  onSaved?: () => void;
}) {
  return (
    <div className="space-y-6">
      <AdminForm action={saveItem} className="space-y-6" onSuccess={onSaved}>
        {item ? <input name="id" type="hidden" value={item.id} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="name" label="Name">
            <Input
              defaultValue={item?.name ?? ""}
              id="name"
              name="name"
              placeholder="Figma"
              required
            />
          </Field>

          <Field
            hint="Leave blank to derive it from the name."
            htmlFor="slug"
            label="Slug"
          >
            <Input
              defaultValue={item?.slug ?? ""}
              id="slug"
              name="slug"
              placeholder="figma"
            />
          </Field>

          <Field htmlFor="categoryId" label="Category">
            {/* `items` is what lets the trigger show the name rather than the
                id it submits. */}
            <Select
              defaultValue={item ? String(item.categoryId) : undefined}
              items={Object.fromEntries(
                categories.map((c) => [String(c.id), c.name])
              )}
              name="categoryId"
              required
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Pick one" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            hint="Shown next to the name."
            htmlFor="badge"
            label="Badge"
          >
            <Input
              defaultValue={item?.badge ?? ""}
              id="badge"
              name="badge"
              placeholder="New"
            />
          </Field>
        </div>

        <Field htmlFor="description" label="Description">
          <Textarea
            defaultValue={item?.description ?? ""}
            id="description"
            name="description"
            rows={3}
          />
        </Field>

        <Field
          hint="Comma separated. Anything new is created as you save."
          htmlFor="tags"
          label="Tags"
        >
          <Input
            defaultValue={item?.tags.join(", ") ?? ""}
            id="tags"
            name="tags"
            placeholder="design, prototyping"
          />
        </Field>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="url" label="Link">
            <Input
              defaultValue={item?.url ?? ""}
              id="url"
              name="url"
              placeholder="https://figma.com"
              type="url"
            />
          </Field>

          <Field htmlFor="dateAdded" label="Date added">
            <Input
              defaultValue={dateValue(item?.dateAdded ?? null)}
              id="dateAdded"
              name="dateAdded"
              type="date"
            />
          </Field>

          <Field
            hint="The original CDN url the asset came from."
            htmlFor="imageSourceUrl"
            label="Image source url"
          >
            <Input
              defaultValue={item?.imageSourceUrl ?? ""}
              id="imageSourceUrl"
              name="imageSourceUrl"
              type="url"
            />
          </Field>

          <Field
            hint="Filled in by the mirror script; edit only to repoint it."
            htmlFor="imageBlobUrl"
            label="Image blob url"
          >
            <Input
              defaultValue={item?.imageBlobUrl ?? ""}
              id="imageBlobUrl"
              name="imageBlobUrl"
              type="url"
            />
          </Field>

          <Field
            hint="Reserves the right aspect before the image loads."
            htmlFor="imageWidth"
            label="Image size"
          >
            <div className="flex gap-2">
              <Input
                defaultValue={item?.imageWidth ?? ""}
                id="imageWidth"
                inputMode="numeric"
                name="imageWidth"
                placeholder="Width"
              />
              <Input
                aria-label="Image height"
                defaultValue={item?.imageHeight ?? ""}
                inputMode="numeric"
                name="imageHeight"
                placeholder="Height"
              />
            </div>
          </Field>

          <Field
            hint="Items are listed alphabetically, so this rarely matters."
            htmlFor="position"
            label="Position"
          >
            <Input
              defaultValue={item?.position ?? 0}
              id="position"
              inputMode="numeric"
              name="position"
            />
          </Field>
        </div>

        <SubmitButton pendingLabel="Saving">
          {item ? "Save changes" : "Create item"}
        </SubmitButton>
      </AdminForm>

      {item ? (
        <AdminForm action={deleteItem} className="border-t pt-4">
          <input name="id" type="hidden" value={item.id} />
          <p className="mb-3 text-muted-foreground text-xs">
            Deleting removes the item and its tag links. It cannot be undone.
          </p>
          <SubmitButton pendingLabel="Deleting" size="sm" variant="destructive">
            Delete item
          </SubmitButton>
        </AdminForm>
      ) : null}
    </div>
  );
}
