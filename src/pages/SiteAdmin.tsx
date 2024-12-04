import React from "react";
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LogoManager } from "@/components/admin/LogoManager";
import { ColorThemeManager } from "@/components/admin/ColorThemeManager";
import { ThemeSettings, ThemeSettingsJson } from "@/types/theme";
import { Tables, Json } from "@/integrations/supabase/types";

const defaultThemeSettings: ThemeSettingsJson = {
  colors: {
    primary: "#000000",
    success: "#16a34a",
    background: "#ffffff",
    foreground: "#000000",
    muted: "#6b7280",
    border: "#e5e7eb"
  },
  fonts: {
    primary: "Inter"
  }
};

const SiteAdmin = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'theme')
        .single();

      if (error && error.code === 'PGRST116') {
        // If no settings exist, create default settings
        const { data: newData, error: createError } = await supabase
          .from('site_settings')
          .insert({
            key: 'theme',
            value: defaultThemeSettings as unknown as Json
          })
          .select()
          .single();

        if (createError) throw createError;
        return { ...newData, value: defaultThemeSettings } as Tables<'site_settings'> & { value: ThemeSettings };
      }

      if (error) throw error;
      
      // Ensure all required color properties exist
      const themeValue = {
        ...defaultThemeSettings,
        ...(data.value as ThemeSettingsJson),
        colors: {
          ...defaultThemeSettings.colors,
          ...((data.value as ThemeSettingsJson)?.colors || {})
        }
      };

      return {
        ...data,
        value: themeValue
      } as Tables<'site_settings'> & { value: ThemeSettings };
    }
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  if (!settings) {
    return <div className="p-8">Error loading settings</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Site Administration</h1>
      </div>

      <div className="grid gap-8">
        <LogoManager settings={settings.value} />
        <ColorThemeManager settings={settings.value} />
      </div>
    </div>
  );
};

export default SiteAdmin;