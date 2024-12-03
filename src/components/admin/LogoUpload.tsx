import React from "react";
import { Image } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSettings } from "@/types/site";

interface LogoUploadProps {
  settings: ThemeSettings;
  onUpdate: (newSettings: ThemeSettings) => void;
}

export const LogoUpload = ({ settings, onUpdate }: LogoUploadProps) => {
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `site-logo-${Date.now()}.${fileExt}`;

      // Upload to site-assets bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      const newSettings = {
        ...settings,
        logo: {
          url: publicUrl,
          alt: 'Site Logo'
        }
      };

      onUpdate(newSettings);
      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error("Failed to upload logo: " + (error as Error).message);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <Image className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Site Logo</h2>
      </div>

      <div className="space-y-4">
        {settings.logo?.url && (
          <div className="w-48 h-24 relative border rounded-lg overflow-hidden">
            <img 
              src={settings.logo.url} 
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
  );
};