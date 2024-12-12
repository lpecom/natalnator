import React from "react";
import { Settings, Palette } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Tables, Json } from "@/integrations/supabase/types";

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

const SiteAdmin = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'theme')
        .single();

      if (error) throw error;
      return data as Tables<'site_settings'> & { value: ThemeSettings };
    }
  });

  const handleColorChange = async (colorKey: string, value: string) => {
    if (!settings) return;

    try {
      const newSettings = {
        ...settings.value as ThemeSettings,
        colors: {
          ...(settings.value as ThemeSettings).colors,
          [colorKey]: value
        }
      };

      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: newSettings as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'theme');

      if (error) throw error;
      
      toast.success("Theme updated successfully");
    } catch (error) {
      toast.error("Failed to update theme");
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!settings) {
    return <div className="p-8">No settings found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Site Administration</h1>
      </div>

      <div className="grid gap-8">
        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Theme Colors</h2>
          </div>

          <div className="grid gap-6">
            {Object.entries((settings.value as ThemeSettings).colors).map(([key, value]) => (
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