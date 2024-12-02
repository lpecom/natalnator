import React from "react";
import { Settings, Palette } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

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
      return data;
    }
  });

  const handleColorChange = async (colorKey: string, value: string) => {
    try {
      const newValue = {
        ...settings.value,
        colors: {
          ...settings.value.colors,
          [colorKey]: value
        }
      };

      const { error } = await supabase
        .from('site_settings')
        .update({ value: newValue })
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
            {Object.entries(settings.value.colors).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex gap-4">
                  <Input
                    type="color"
                    value={value as string}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={value as string}
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