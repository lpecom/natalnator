import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ViewCommonPage = () => {
  const { slug } = useParams();

  const { data: page } = useQuery({
    queryKey: ["common-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("common_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (!page) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content_html }} 
      />
    </div>
  );
};

export default ViewCommonPage;