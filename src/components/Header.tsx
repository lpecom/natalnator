import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

const Header = () => {
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

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            {settings?.logo?.url ? (
              <img
                src={settings.logo.url}
                alt="Logo"
                className="h-8 w-auto"
              />
            ) : (
              "Loja"
            )}
          </Link>
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  to="/catalog" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Catálogo
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;