import React from "react";
import { Image } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ThemeSettings } from "@/types/theme";

interface LogoManagerProps {
  settings: ThemeSettings;
}

export const LogoManager = ({ settings }: LogoManagerProps) => {
  const queryClient = useQueryClient();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      // Update site settings with new logo URL
      const newSettings = {
        ...settings,
        logo: {
          url: publicUrl
        }
      };

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ 
          value: newSettings,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'theme');

      if (updateError) throw updateError;
      
      toast.success("Logo updated successfully");
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error("Failed to upload logo");
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <Image className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Logo</h2>
      </div>

      <div className="space-y-4">
        {settings?.logo?.url && (
          <div className="w-32">
            <img 
              src={settings.logo.url} 
              alt="Site logo" 
              className="w-full h-auto"
            />
          </div>
        )}
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="max-w-sm"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Recommended size: 200x50px
          </p>
        </div>
      </div>
    </div>
  );
};