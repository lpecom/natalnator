import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PenIcon } from "lucide-react";

const CommonPages = () => {
  const { toast } = useToast();

  const { data: pages, refetch } = useQuery({
    queryKey: ["common-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("common_pages")
        .select("*")
        .order("title");
      
      if (error) throw error;
      return data;
    },
  });

  const togglePageStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("common_pages")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update page status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Page status updated successfully",
    });
    refetch();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Common Pages</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Active</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages?.map((page) => (
                <tr key={page.id} className="border-b">
                  <td className="px-6 py-4 text-sm">{page.title}</td>
                  <td className="px-6 py-4 text-sm">{page.slug}</td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={page.is_active}
                      onCheckedChange={() => togglePageStatus(page.id, page.is_active)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/common-pages/${page.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <PenIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommonPages;