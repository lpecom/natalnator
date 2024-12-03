import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'theme')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
      
      console.log('Fetched site settings:', data?.value);
      return data?.value as ThemeSettings;
    }
  });

  const logoUrl = settings?.logo?.url;
  console.log('Logo URL:', logoUrl);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-[125px] h-auto"
                  onError={(e) => {
                    console.error('Error loading logo:', e);
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">Loja</span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-10">
            <Link
              to="/catalog"
              className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Catálogo
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } absolute top-full left-0 w-full bg-white border-b transform transition-all duration-300 ease-in-out md:hidden`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          <Link
            to="/catalog"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Catálogo
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;