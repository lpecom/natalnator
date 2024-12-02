import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Benefits from "@/components/Benefits";
import { Skeleton } from "@/components/ui/skeleton";

const EditLandingPage = () => {
  const { id } = useParams();

  const { data: landingPage, isLoading } = useQuery({
    queryKey: ["landing-page", id],
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
      <div className="container py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Landing page not found</h1>
      </div>
    );
  }

  const product = landingPage.landing_page_products[0];

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{landingPage.title}</h1>
        <a 
          href={`/p/${landingPage.id}`} 
          target="_blank" 
          className="text-blue-600 hover:underline"
        >
          Preview Page
        </a>
      </div>

      {product && (
        <Benefits 
          productId={product.id}
          editable={true}
        />
      )}
    </div>
  );
};

export default EditLandingPage;