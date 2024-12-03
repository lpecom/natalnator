import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

const BannerList = () => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
  );
};

export default BannerList;