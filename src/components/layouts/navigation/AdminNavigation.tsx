import { LayoutDashboard, Package, Settings, FileText, Image } from "lucide-react";

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
    name: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];