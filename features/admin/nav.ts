import { FolderTree, Mail, Package, Tags } from "lucide-react";

/** The editor's sections, shared by the sidebar and the header title. */
export const NAV = [
  {
    href: "/admin",
    label: "Items",
    icon: Package,
    description: "Everything in the catalog",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FolderTree,
    description: "Columns in the browser",
  },
  {
    href: "/admin/tags",
    label: "Tags",
    icon: Tags,
    description: "Labels shared across items",
  },
  {
    href: "/admin/subscribers",
    label: "Subscribers",
    icon: Mail,
    description: "People on the mailing list",
  },
] as const;

export type NavItem = (typeof NAV)[number];
