import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Image, Trash2 } from "lucide-react";

const BannerAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createBanner = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data, error } = await supabase
        .from("banners")
        .insert([
          {
            name: formData.get("name"),
            desktop_image_url: formData.get("desktop_image_url"),
            mobile_image_url: formData.get("mobile_image_url"),
            link_url: formData.get("link_url"),
            banner_type: formData.get("banner_type"),
            display_order: parseInt(formData.get("display_order") as string),
            is_active: true,
          },
        ])
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

  const updateBanner = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("banners")
        .update({ is_active })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({
        title: "Banner updated successfully",
        description: "The banner status has been updated.",
      });
    },
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("banners")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({
        title: "Banner deleted successfully",
        description: "The banner has been removed from the homepage.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createBanner.mutate(formData);
    e.currentTarget.reset();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <Image className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Banner Management</h1>
      </div>

      <div className="grid gap-8">
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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Existing Banners</h2>
          <div className="grid gap-4">
            {banners?.map((banner) => (
              <div
                key={banner.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={banner.mobile_image_url}
                    alt={banner.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{banner.name}</h3>
                    <p className="text-sm text-gray-500">
                      Type: {banner.banner_type}, Order: {banner.display_order}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={banner.is_active}
                      onCheckedChange={(checked) =>
                        updateBanner.mutate({ id: banner.id, is_active: checked })
                      }
                    />
                    <span className="text-sm text-gray-500">
                      {banner.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteBanner.mutate(banner.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAdmin;