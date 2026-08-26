import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";

const { categories, items, tags, itemTags } = schema;

const json = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});

export const SERVER_INFO = { name: "catalog", version: "1.0.0" } as const;

/**
 * The catalog tools, shared by both transports: `mcp/server.ts` runs them over
 * stdio for local development, `app/api/mcp/route.ts` serves the same set over
 * HTTP so nobody needs a database of their own.
 *
 * Every tool is a SELECT. There is no write path, so this is safe to point at
 * production.
 */
export function registerCatalogTools(server: McpServer) {
  server.registerTool(
    "list_categories",
    {
      title: "List categories",
      description:
        "List every catalog category with its slug and how many items it holds.",
      inputSchema: {},
    },
    async () => {
      const rows = await db
        .select({
          slug: categories.slug,
          name: categories.name,
          itemCount: sql<number>`count(${items.id})::int`,
        })
        .from(categories)
        .leftJoin(items, eq(items.categoryId, categories.id))
        .groupBy(
          categories.id,
          categories.slug,
          categories.name,
          categories.position
        )
        .orderBy(asc(categories.position));

      return json(rows);
    }
  );

  server.registerTool(
    "list_items",
    {
      title: "List items",
      description:
        "List catalog items, optionally filtered to a single category slug.",
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe("Category slug, e.g. 'apps' or 'studios'. Omit for all."),
        limit: z.number().int().min(1).max(200).default(50),
      },
    },
    async ({ category, limit }) => {
      const rows = await db
        .select({
          slug: items.slug,
          name: items.name,
          category: categories.slug,
          description: items.description,
          url: items.url,
        })
        .from(items)
        .innerJoin(categories, eq(items.categoryId, categories.id))
        .where(category ? eq(categories.slug, category) : undefined)
        .orderBy(asc(categories.position), asc(items.position))
        .limit(limit);

      return json(rows);
    }
  );

  server.registerTool(
    "get_item",
    {
      title: "Get item",
      description: "Fetch one catalog item with its full detail and tags.",
      inputSchema: {
        category: z.string().describe("Category slug, e.g. 'apps'."),
        slug: z.string().describe("Item slug, e.g. 'cleanshot'."),
      },
    },
    async ({ category, slug }) => {
      const [row] = await db
        .select({
          id: items.id,
          slug: items.slug,
          name: items.name,
          category: categories.slug,
          description: items.description,
          url: items.url,
          imageUrl: items.imageBlobUrl,
          dateAdded: items.dateAdded,
        })
        .from(items)
        .innerJoin(categories, eq(items.categoryId, categories.id))
        .where(and(eq(categories.slug, category), eq(items.slug, slug)));

      if (!row) {
        return json({ error: `No item ${category}/${slug}` });
      }

      const itemTagRows = await db
        .select({ name: tags.name })
        .from(itemTags)
        .innerJoin(tags, eq(itemTags.tagId, tags.id))
        .where(eq(itemTags.itemId, row.id));

      const { id, ...rest } = row;
      return json({ ...rest, tags: itemTagRows.map((t) => t.name) });
    }
  );

  server.registerTool(
    "search_items",
    {
      title: "Search items",
      description:
        "Case-insensitive search across item names and descriptions.",
      inputSchema: {
        query: z.string().min(1).describe("Text to search for."),
        limit: z.number().int().min(1).max(100).default(20),
      },
    },
    async ({ query, limit }) => {
      const pattern = `%${query}%`;
      const rows = await db
        .select({
          slug: items.slug,
          name: items.name,
          category: categories.slug,
          description: items.description,
          url: items.url,
        })
        .from(items)
        .innerJoin(categories, eq(items.categoryId, categories.id))
        .where(
          or(ilike(items.name, pattern), ilike(items.description, pattern))
        )
        .orderBy(asc(items.name))
        .limit(limit);

      return json(rows);
    }
  );

  server.registerTool(
    "list_tags",
    {
      title: "List tags",
      description: "List every tag with how many items carry it.",
      inputSchema: {},
    },
    async () => {
      const rows = await db
        .select({
          name: tags.name,
          slug: tags.slug,
          itemCount: sql<number>`count(${itemTags.itemId})::int`,
        })
        .from(tags)
        .leftJoin(itemTags, eq(itemTags.tagId, tags.id))
        .groupBy(tags.id, tags.name, tags.slug)
        .orderBy(sql`count(${itemTags.itemId}) desc`, asc(tags.name));

      return json(rows);
    }
  );

  server.registerTool(
    "items_by_tag",
    {
      title: "Items by tag",
      description: "List every item carrying a given tag.",
      inputSchema: {
        tag: z.string().describe("Tag name or slug, e.g. 'macOS' or 'macos'."),
      },
    },
    async ({ tag }) => {
      const rows = await db
        .select({
          slug: items.slug,
          name: items.name,
          category: categories.slug,
          url: items.url,
        })
        .from(itemTags)
        .innerJoin(tags, eq(itemTags.tagId, tags.id))
        .innerJoin(items, eq(itemTags.itemId, items.id))
        .innerJoin(categories, eq(items.categoryId, categories.id))
        .where(or(ilike(tags.name, tag), eq(tags.slug, tag.toLowerCase())))
        .orderBy(asc(items.name));

      return json(rows);
    }
  );
}
