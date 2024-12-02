import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  product_name?: string;
  admin_editable: boolean;
}

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

  const handleSaveReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReview) return;

    const formData = new FormData(e.currentTarget);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          author: formData.get("author"),
          rating: Number(formData.get("rating")),
          content: formData.get("content"),
          verified: formData.get("verified") === "true",
          product_name: formData.get("product_name"),
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
              <form onSubmit={handleSaveReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    name="author"
                    type="text"
                    defaultValue={review.author}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <input
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    defaultValue={review.rating}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    name="content"
                    defaultValue={review.content}
                    className="w-full p-2 border rounded h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input
                    name="product_name"
                    type="text"
                    defaultValue={review.product_name}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    name="verified"
                    type="checkbox"
                    defaultChecked={review.verified}
                    value="true"
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Verified Review</label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingReview(null)}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{review.author}</div>
                  <div className="flex items-center gap-2">
                    {review.admin_editable && (
                      <>
                        <button
                          onClick={() => setEditingReview(review)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  {review.verified && (
                    <span className="ml-2 text-sm text-green-600">✓ Verified</span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{review.content}</p>
                {review.product_name && (
                  <p className="text-sm text-gray-500">
                    Product: {review.product_name}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsManager;