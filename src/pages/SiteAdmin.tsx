import React from "react";
import { Settings, Palette } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Json } from "@/integrations/supabase/types";

interface ThemeSettings {
  colors: {
    primary: string;
    success: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    primary: string;
  };
}

const defaultTheme: ThemeSettings = {
  colors: {
    primary: "#0066FF",
    success: "#10B981",
    background: "#FFFFFF",
    foreground: "#000000",
    muted: "#6B7280",
    border: "#E5E7EB"
  },
  fonts: {
    primary: "Inter"
  }
};

const isThemeSettings = (value: unknown): value is ThemeSettings => {
  const theme = value as ThemeSettings;
  return (
    theme !== null &&
    typeof theme === 'object' &&
    'colors' in theme &&
    'fonts' in theme &&
    typeof theme.colors === 'object' &&
    typeof theme.fonts === 'object'
  );
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

      if (error) {
        console.error('Error fetching theme settings:', error);
        throw error;
      }
      
      // If no theme settings exist, create default ones
      if (!data) {
        const { data: newSettings, error: insertError } = await supabase
          .from('site_settings')
          .insert({
            key: 'theme',
            value: defaultTheme as unknown as Json
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newSettings;
      }

      return data;
    }
  });

  const handleColorChange = async (colorKey: string, value: string) => {
    if (!settings) return;

    try {
      const currentValue = settings.value;
      if (!isThemeSettings(currentValue)) {
        throw new Error('Invalid theme settings format');
      }

      // Create a new theme object with the updated color
      const newTheme = {
        colors: {
          ...currentValue.colors,
          [colorKey]: value
        },
        fonts: { ...currentValue.fonts }
      } satisfies ThemeSettings;

      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: newTheme as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'theme');

      if (error) throw error;
      
      toast.success("Theme updated successfully");
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error("Failed to update theme");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const themeValue = settings?.value;
  if (!isThemeSettings(themeValue)) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-500">Invalid theme settings</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Site Administration</h1>
      </div>

      <div className="grid gap-8">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Theme Colors</h2>
          </div>

          <div className="grid gap-6">
            {Object.entries(themeValue.colors).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex gap-4">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteAdmin;