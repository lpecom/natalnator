import React from "react";
import type { Review, ReviewFormData } from "@/types/review";

interface ReviewFormProps {
  review: Review;
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
}

const ReviewForm = ({ review, onSubmit, onCancel }: ReviewFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      author: String(formData.get("author")),
      rating: Number(formData.get("rating")),
      content: String(formData.get("content")),
      verified: formData.get("verified") === "true",
      product_name: formData.get("product_name") ? String(formData.get("product_name")) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;