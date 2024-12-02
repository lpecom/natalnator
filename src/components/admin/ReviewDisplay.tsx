import React from "react";
import type { Review } from "@/types/review";

interface ReviewDisplayProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

const ReviewDisplay = ({ review, onEdit, onDelete }: ReviewDisplayProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{review.author}</div>
        <div className="flex items-center gap-2">
          {review.admin_editable && (
            <>
              <button
                onClick={onEdit}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
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
  );
};

export default ReviewDisplay;