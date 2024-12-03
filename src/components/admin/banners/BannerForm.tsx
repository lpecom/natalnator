import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const BannerForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, type: 'desktop' | 'mobile') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/functions/v1/upload-banner', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const { url } = await response.json();
    return url;
  };

  const createBanner = useMutation({
    mutationFn: async (formData: FormData) => {
      setIsUploading(true);
      try {
        const desktopFile = formData.get('desktop_image') as File;
        const mobileFile = formData.get('mobile_image') as File;

        const [desktopUrl, mobileUrl] = await Promise.all([
          uploadFile(desktopFile, 'desktop'),
          uploadFile(mobileFile, 'mobile'),
        ]);

        const bannerData = {
          name: String(formData.get("name")),
          desktop_image_url: desktopUrl,
          mobile_image_url: mobileUrl,
          link_url: formData.get("link_url") ? String(formData.get("link_url")) : null,
          banner_type: String(formData.get("banner_type")),
          display_order: parseInt(String(formData.get("display_order"))),
          is_active: true,
        };

        const { data, error } = await supabase
          .from("banners")
          .insert(bannerData)
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({
        title: "Banner created successfully",
        description: "The banner has been added to the homepage.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating banner",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createBanner.mutate(formData);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
      
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Banner Name</Label>
          <Input id="name" name="name" required />
        </div>

        <div>
          <Label htmlFor="desktop_image">Desktop Image</Label>
          <Input 
            id="desktop_image" 
            name="desktop_image" 
            type="file" 
            accept="image/*"
            required 
          />
          <p className="text-sm text-gray-500 mt-1">Recommended size: 1920x600px</p>
        </div>

        <div>
          <Label htmlFor="mobile_image">Mobile Image</Label>
          <Input 
            id="mobile_image" 
            name="mobile_image" 
            type="file" 
            accept="image/*"
            required 
          />
          <p className="text-sm text-gray-500 mt-1">Recommended size: 750x800px</p>
        </div>

        <div>
          <Label htmlFor="link_url">Link URL</Label>
          <Input id="link_url" name="link_url" type="url" />
        </div>

        <div>
          <Label htmlFor="banner_type">Banner Type</Label>
          <Select name="banner_type" defaultValue="small">
            <SelectTrigger>
              <SelectValue placeholder="Select banner type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main Banner</SelectItem>
              <SelectItem value="small">Small Banner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input id="display_order" name="display_order" type="number" defaultValue="0" required />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Add Banner'
        )}
      </Button>
    </form>
  );
};

export default BannerForm;