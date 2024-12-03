import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const HomeBanners = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Hero Banner Skeleton */}
        <div className="w-full">
          <Skeleton className="w-full aspect-[3/1] md:aspect-[3/0.8] rounded-none" />
        </div>
        
        {/* Small Banners Skeleton */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="w-full aspect-square md:aspect-[3/2] rounded-lg" />
            <Skeleton className="w-full aspect-square md:aspect-[3/2] rounded-lg" />
            <Skeleton className="w-full aspect-square md:aspect-[3/2] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const mainBanner = banners?.find(banner => banner.banner_type === "main");
  const smallBanners = banners?.filter(banner => banner.banner_type === "small") || [];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      {mainBanner && (
        <Link to={mainBanner.link_url || "#"} className="block w-full">
          <picture>
            <source media="(min-width: 768px)" srcSet={mainBanner.desktop_image_url} />
            <img
              src={mainBanner.mobile_image_url}
              alt={mainBanner.name}
              className="w-full h-auto object-cover"
            />
          </picture>
        </Link>
      )}
      
      {/* Small Banners */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {smallBanners.slice(0, 3).map((banner) => (
            <Link key={banner.id} to={banner.link_url || "#"} className="block">
              <picture>
                <source media="(min-width: 768px)" srcSet={banner.desktop_image_url} />
                <img
                  src={banner.mobile_image_url}
                  alt={banner.name}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </picture>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBanners;