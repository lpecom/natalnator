import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Image, Settings, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface ThemeSettings {
  colors?: {
    primary: string;
    success: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts?: {
    primary: string;
  };
  logo?: {
    url: string;
  };
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'theme')
        .single();

      if (error) throw error;
      return data?.value as ThemeSettings;
    }
  });

  const navigation = [
    {
      name: "Product",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Landing Pages",
      href: "/landing-pages",
      icon: Image,
    },
    {
      name: "Common Pages",
      href: "/admin/common-pages",
      icon: FileText,
    },
    {
      name: "Site Settings",
      href: "/admin/site",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4">
                  <Link to="/">
                    {settings?.logo?.url ? (
                      <img
                        src={settings.logo.url}
                        alt="Logo"
                        className="h-8 w-auto"
                      />
                    ) : (
                      <img
                        src="/lovable-uploads/afad369a-bb88-4bbc-aba2-54ae54f3591e.png"
                        alt="Logo"
                        className="h-8 w-auto"
                      />
                    )}
                  </Link>
                </div>
                <nav className="mt-8 flex-1 space-y-1 px-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          location.pathname === item.href
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                        )}
                      >
                        <Icon
                          className={cn(
                            location.pathname === item.href
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 h-5 w-5 flex-shrink-0"
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;