import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTag, saveTag } from "./actions/tags";
import { AdminForm } from "./form";
import type { AdminTag } from "./queries/tags";
import { SubmitButton } from "./submit-button";

/**
 * A row's inputs sit in separate cells, so they join their form through the
 * `form` attribute rather than by being nested inside it.
 */
export function TagsEditor({ tags }: { tags: AdminTag[] }) {
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-20">Items</TableHead>
              <TableHead className="w-44 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tags.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={4}
                >
                  No tags yet. They are created as you tag an item.
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <Input
                      aria-label={`Name of ${tag.name}`}
                      defaultValue={tag.name}
                      form={`tag-${tag.id}`}
                      name="name"
                      required
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      aria-label={`Slug of ${tag.name}`}
                      defaultValue={tag.slug}
                      form={`tag-${tag.id}`}
                      name="slug"
                    />
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{tag.itemCount}</Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-start justify-end gap-2">
                      <AdminForm action={saveTag} id={`tag-${tag.id}`}>
                        <input name="id" type="hidden" value={tag.id} />
                        <SubmitButton pendingLabel="Saving" size="sm">
                          Save
                        </SubmitButton>
                      </AdminForm>

                      <AdminForm action={deleteTag}>
                        <input name="id" type="hidden" value={tag.id} />
                        <SubmitButton
                          pendingLabel="Deleting"
                          size="sm"
                          variant="ghost"
                        >
                          Delete
                        </SubmitButton>
                      </AdminForm>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>New tag</CardTitle>
          <CardDescription>
            Tags are also created automatically when you type a new one on an
            item.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AdminForm
            action={saveTag}
            className="flex flex-wrap items-end gap-3"
          >
            <Input
              aria-label="Tag name"
              className="w-48"
              name="name"
              placeholder="Prototyping"
              required
            />
            <Input
              aria-label="Tag slug"
              className="w-48"
              name="slug"
              placeholder="prototyping"
            />
            <SubmitButton pendingLabel="Adding" size="sm" variant="secondary">
              <Plus data-icon="inline-start" />
              Add tag
            </SubmitButton>
          </AdminForm>
        </CardContent>
      </Card>
    </div>
  );
}
