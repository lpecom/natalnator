import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Review, ReviewFormData } from "@/types/review";
import ReviewForm from "./ReviewForm";
import ReviewDisplay from "./ReviewDisplay";

interface ReviewsManagerProps {
  landingPageId: string;
}

const ReviewsManager = ({ landingPageId }: ReviewsManagerProps) => {
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data: reviews, refetch } = useQuery({
    queryKey: ["admin-reviews", landingPageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("landing_page_id", landingPageId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  const handleSaveReview = async (formData: ReviewFormData) => {
    if (!editingReview) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          author: formData.author,
          rating: formData.rating,
          content: formData.content,
          verified: formData.verified,
          product_name: formData.product_name,
        })
        .eq("id", editingReview.id);

      if (error) throw error;
      
      toast.success("Review updated successfully");
      setEditingReview(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Review deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Reviews Management</h2>
      </div>

      <div className="space-y-4">
        {reviews?.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            {editingReview?.id === review.id ? (
              <ReviewForm
                review={review}
                onSubmit={handleSaveReview}
                onCancel={() => setEditingReview(null)}
              />
            ) : (
              <ReviewDisplay
                review={review}
                onEdit={() => setEditingReview(review)}
                onDelete={() => handleDeleteReview(review.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsManager;