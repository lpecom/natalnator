import { LayoutDashboard, Package, Settings, FileText, Image, Layers, Upload } from "lucide-react";

export const adminNavigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Import Products",
    href: "/admin/import-products",
    icon: Upload,
  },
  {
    name: "Landing Pages",
    href: "/admin/landing-pages",
    icon: Layers,
  },
  {
    name: "Common Pages",
    href: "/admin/common-pages",
    icon: FileText,
  },
  {
    name: "Banners",
    href: "/admin/banners",
    icon: Image,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];