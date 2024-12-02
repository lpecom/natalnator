import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ReviewsProps {
  landingPageId?: string;
  editable?: boolean;
}

type Review = {
  id: string;
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  product_name?: string;
  admin_editable: boolean;
};

const Reviews = ({ landingPageId, editable = false }: ReviewsProps) => {
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", landingPageId],
    queryFn: async () => {
      if (!landingPageId) return [];

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("landing_page_id", landingPageId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!landingPageId,
  });

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-primary text-primary" : "text-muted"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="h-full">
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded-full w-8 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const displayReviews = reviews || [];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayReviews.map((review) => (
          <Card key={review.id} className="h-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {review.author.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{review.author}</div>
                </div>
                {editable && review.admin_editable && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex mb-3">{renderStars(review.rating)}</div>
              <p className="text-sm text-muted-foreground mb-3">
                {review.content}
              </p>
              {review.product_name && (
                <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                  {review.product_name}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;