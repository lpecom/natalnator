import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const BannerForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBanner = useMutation({
    mutationFn: async (formData: FormData) => {
      const bannerData = {
        name: String(formData.get("name")),
        desktop_image_url: String(formData.get("desktop_image_url")),
        mobile_image_url: String(formData.get("mobile_image_url")),
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({
        title: "Banner created successfully",
        description: "The banner has been added to the homepage.",
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
          <Label htmlFor="desktop_image_url">Desktop Image URL</Label>
          <Input id="desktop_image_url" name="desktop_image_url" type="url" required />
        </div>

        <div>
          <Label htmlFor="mobile_image_url">Mobile Image URL</Label>
          <Input id="mobile_image_url" name="mobile_image_url" type="url" required />
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

      <Button type="submit" className="w-full">
        Add Banner
      </Button>
    </form>
  );
};

export default BannerForm;