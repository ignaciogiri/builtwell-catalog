import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteCategory, saveCategory } from "./actions/categories";
import { Field } from "./fields";
import { AdminForm } from "./form";
import type { AdminCategory } from "./queries/categories";
import { SubmitButton } from "./submit-button";

export function CategoriesEditor({
  categories,
}: {
  categories: AdminCategory[];
}) {
  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {category.name}
              {category.badge ? (
                <Badge variant="secondary">{category.badge}</Badge>
              ) : null}
            </CardTitle>
            <CardDescription>
              /{category.slug} — {category.itemCount} item
              {category.itemCount === 1 ? "" : "s"}
            </CardDescription>

            <CardAction>
              {/* A separate form: HTML forbids nesting one inside another. */}
              <AdminForm action={deleteCategory}>
                <input name="id" type="hidden" value={category.id} />
                <SubmitButton
                  pendingLabel="Deleting"
                  size="sm"
                  variant="ghost"
                >
                  Delete
                </SubmitButton>
              </AdminForm>
            </CardAction>
          </CardHeader>

          <CardContent>
            <AdminForm action={saveCategory}>
              <input name="id" type="hidden" value={category.id} />
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_6rem]">
                <Field htmlFor={`name-${category.id}`} label="Name">
                  <Input
                    defaultValue={category.name}
                    id={`name-${category.id}`}
                    name="name"
                    required
                  />
                </Field>
                <Field htmlFor={`slug-${category.id}`} label="Slug">
                  <Input
                    defaultValue={category.slug}
                    id={`slug-${category.id}`}
                    name="slug"
                  />
                </Field>
                <Field htmlFor={`badge-${category.id}`} label="Badge">
                  <Input
                    defaultValue={category.badge ?? ""}
                    id={`badge-${category.id}`}
                    name="badge"
                  />
                </Field>
                <Field htmlFor={`position-${category.id}`} label="Position">
                  <Input
                    defaultValue={category.position}
                    id={`position-${category.id}`}
                    inputMode="numeric"
                    name="position"
                  />
                </Field>
              </div>
              <SubmitButton className="mt-4" pendingLabel="Saving" size="sm">
                Save
              </SubmitButton>
            </AdminForm>
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>New category</CardTitle>
          <CardDescription>
            Deleting a category later takes its items with it.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AdminForm action={saveCategory}>
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_6rem]">
              <Field htmlFor="new-category-name" label="Name">
                <Input
                  id="new-category-name"
                  name="name"
                  placeholder="Foundries"
                  required
                />
              </Field>
              <Field htmlFor="new-category-slug" label="Slug">
                <Input
                  id="new-category-slug"
                  name="slug"
                  placeholder="foundries"
                />
              </Field>
              <Field htmlFor="new-category-badge" label="Badge">
                <Input id="new-category-badge" name="badge" />
              </Field>
              <Field htmlFor="new-category-position" label="Position">
                <Input
                  defaultValue={0}
                  id="new-category-position"
                  inputMode="numeric"
                  name="position"
                />
              </Field>
            </div>
            <SubmitButton
              className="mt-4"
              pendingLabel="Adding"
              size="sm"
              variant="secondary"
            >
              <Plus data-icon="inline-start" />
              Add category
            </SubmitButton>
          </AdminForm>
        </CardContent>
      </Card>
    </div>
  );
}
