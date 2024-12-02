import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const EditLandingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: landingPage, isLoading } = useQuery({
    queryKey: ["landingPage", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select(`
          *,
          landing_page_products (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p>Landing page not found</p>
          <Button onClick={() => navigate("/landing-pages")}>
            Back to Landing Pages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Landing Page</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/landing-pages")}>
              Cancel
            </Button>
            <Button onClick={() => navigate(`/landing-pages/${landingPage.id}/admin`)}>
              Edit Product
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{landingPage.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      landingPage.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {landingPage.status}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <p className="mt-1 text-sm text-gray-500">{landingPage.slug}</p>
              </div>

              {landingPage.landing_page_products?.map((product: any) => (
                <div key={product.id} className="border-t pt-4">
                  <h3 className="font-medium">Product Information</h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {product.name}
                    </p>
                    <p>
                      <span className="font-medium">Price:</span> R${" "}
                      {product.price}
                    </p>
                    <p>
                      <span className="font-medium">Original Price:</span> R${" "}
                      {product.original_price}
                    </p>
                    <p>
                      <span className="font-medium">Stock:</span> {product.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditLandingPage;