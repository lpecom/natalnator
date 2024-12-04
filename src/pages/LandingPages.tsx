import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Eye, PenSquare, Plus } from "lucide-react";

const LandingPages = () => {
  const { data: landingPages, isLoading } = useQuery({
    queryKey: ["landing-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select(`
          *,
          landing_page_products (
            id,
            name,
            price,
            stock
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Landing Pages</h1>
        <Link to="/admin/landing-pages/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Landing Page
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {landingPages?.map((page) => (
          <div
            key={page.id}
            className="bg-white border rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">{page.title}</h2>
                  <Badge
                    variant={page.status === "published" ? "success" : "secondary"}
                  >
                    {page.status}
                  </Badge>
                  {page.is_homepage && (
                    <Badge variant="outline">Homepage</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  /{page.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/p/${page.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </Link>
                <Link to={`/admin/landing-pages/${page.id}/edit`}>
                  <Button variant="default" size="sm" className="gap-2">
                    <PenSquare className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Products</h3>
              {page.landing_page_products?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {page.landing_page_products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-50 p-3 rounded-md text-sm"
                    >
                      <p className="font-medium">{product.name}</p>
                      <div className="flex justify-between items-center mt-1 text-muted-foreground">
                        <span>R$ {product.price.toFixed(2)}</span>
                        <span>Stock: {product.stock || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No products added yet
                </p>
              )}
            </div>
          </div>
        ))}

        {landingPages?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No landing pages yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first landing page
            </p>
            <Link to="/admin/landing-pages/create">
              <Button>Create Landing Page</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPages;