import React from "react";
import { Settings, Palette, Image } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  logo?: {
    url: string;
    alt: string;
  };
}

const SiteAdmin = () => {
  const queryClient = useQueryClient();

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

  const updateSettings = useMutation({
    mutationFn: async (newSettings: ThemeSettings) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: newSettings as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'theme');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success("Settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update settings");
    }
  });

  const handleColorChange = (colorKey: string, value: string) => {
    if (!settings) return;

    const newSettings = {
      ...settings.value as ThemeSettings,
      colors: {
        ...(settings.value as ThemeSettings).colors,
        [colorKey]: value
      }
    };

    updateSettings.mutate(newSettings);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `site-logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      if (!settings) return;

      const newSettings = {
        ...settings.value as ThemeSettings,
        logo: {
          url: publicUrl,
          alt: 'Site Logo'
        }
      };

      updateSettings.mutate(newSettings);
    } catch (error) {
      toast.error("Failed to upload logo");
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
            <Image className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Site Logo</h2>
          </div>

          <div className="space-y-4">
            {(settings.value as ThemeSettings).logo?.url && (
              <div className="w-48 h-24 relative border rounded-lg overflow-hidden">
                <img 
                  src={(settings.value as ThemeSettings).logo?.url} 
                  alt="Site Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-1">
                Recommended size: 240x80px
              </p>
            </div>
          </div>
        </div>

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