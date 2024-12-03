import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const navigate = useNavigate();
  
  const { data: landingPage, isLoading } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("is_homepage", true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handlePreviewClick = () => {
    if (landingPage?.id) {
      navigate(`/p/${landingPage.slug}`);
    } else {
      navigate("/");
    }
  };
  
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button
        onClick={handlePreviewClick}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Carregando..." : "Visualizar Página"}
      </button>
    </div>
  );
};

export default AdminHeader;