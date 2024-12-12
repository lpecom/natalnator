import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getTemplate } from "@/components/templates";

const ProductPage = () => {
  const { id } = useParams();

  const { data: landingPage } = useQuery({
    queryKey: ["landing-page", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id)
        .single();
      return data;
    },
  });

  if (!landingPage) {
    return <div>Loading...</div>;
  }

  const Template = getTemplate(landingPage.template_name);
  return <Template landingPageId={landingPage.id} />;
};

export default ProductPage;