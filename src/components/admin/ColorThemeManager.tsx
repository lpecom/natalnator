import React from "react";
import { Palette } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ThemeSettings } from "@/types/theme";

interface ColorThemeManagerProps {
  settings: ThemeSettings;
}

export const ColorThemeManager = ({ settings }: ColorThemeManagerProps) => {
  const queryClient = useQueryClient();

  const handleColorChange = async (colorKey: string, value: string) => {
    try {
      const newSettings = {
        ...settings,
        colors: {
          ...settings.colors,
          [colorKey]: value
        }
      };

      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: newSettings,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'theme');

      if (error) throw error;
      
      toast.success("Theme updated successfully");
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (error) {
      toast.error("Failed to update theme");
      console.error('Error updating theme:', error);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Theme Colors</h2>
      </div>

      <div className="grid gap-6">
        {Object.entries(settings.colors).map(([key, value]) => (
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
  );
};