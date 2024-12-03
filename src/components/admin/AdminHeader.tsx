import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const navigate = useNavigate();
  
  const { data: landingPage } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("is_homepage", true)
        .single();
      return data;
    },
  });

  const previewUrl = landingPage?.slug ? `/p/${landingPage.slug}` : "/";
  
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button
        onClick={() => navigate(previewUrl)}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        View Page
      </button>
    </div>
  );
};

export default AdminHeader;