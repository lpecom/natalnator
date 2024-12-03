import React, { useState } from "react";
import { Image, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeSettings } from "@/types/theme";

interface LogoManagerProps {
  settings: ThemeSettings;
}

export const LogoManager = ({ settings }: LogoManagerProps) => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(settings?.logo?.url || null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      // Add upsert and cacheControl options
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true // Allow overwriting existing files
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      // Delete old logo file if it exists
      if (settings?.logo?.url) {
        const oldFileName = settings.logo.url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('site-assets')
            .remove([oldFileName]);
        }
      }

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
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error("Failed to upload logo: " + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async () => {
    try {
      if (settings?.logo?.url) {
        const fileName = settings.logo.url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('site-assets')
            .remove([fileName]);
        }
      }

      const newSettings = {
        ...settings,
        logo: undefined
      };

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ 
          value: newSettings,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'theme');

      if (updateError) throw updateError;
      
      toast.success("Logo removed successfully");
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error("Failed to remove logo: " + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <Image className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Logo</h2>
      </div>

      <div className="space-y-4">
        {(previewUrl || settings?.logo?.url) && (
          <div className="flex items-center gap-4">
            <div className="w-32">
              <img 
                src={previewUrl || settings?.logo?.url} 
                alt="Site logo" 
                className="w-full h-auto"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove Logo
            </Button>
          </div>
        )}
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="max-w-sm"
          />
          <p className="text-sm text-muted-foreground">
            Recommended size: 200x50px
          </p>
          {selectedFile && (
            <Button onClick={handleSave} className="mt-4">
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};