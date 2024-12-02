import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

type Review = {
  id: string;
  author: string;
  rating: number;
  content: string;
  verified?: boolean;
  productName?: string;
};

const reviews: Review[] = [
  {
    id: "1",
    author: "Darrell D.",
    rating: 5,
    content: "Great Product. My wife loves the unit and makes her toe nails as sexy as a movie star! Thanks for making such a quality product that saves time since you can do all the nails on one foot at a time : )",
    verified: true,
    productName: "Pentachom Antifungal Laser Program"
  },
  {
    id: "2",
    author: "Erin H.",
    rating: 5,
    content: "Amazing laser light device, this is working very good on both of my toes with nail fungus and seems to be getting rid of a small case of athletes foot I have, as well. Although I do take oral medication for my nail fungus, I only started seeing better results after purchasing this laser light device.",
    verified: true,
    productName: "Pentachom Antifungal Laser Program"
  },
  {
    id: "3",
    author: "Angel H.",
    rating: 5,
    content: "So I started skeptical. But using as directed it does take time but ive noticed changes, my nails less brittle not so yellow not falling off, again it's not over night fix especially since I've had nail fungus for as long as I can remember on 3 toes my big toe is the longest it's ever been. Also I had broken my laser on accident. The customer service was absolutely amazing I was worried they wouldn't replace but they exceeded my expectations. I would definitely recommend.",
    verified: true,
    productName: "Pentachom Antifungal Laser Program"
  },
  {
    id: "4",
    author: "Colleen H.",
    rating: 5,
    content: "Was using paint on solutions but they were very slow at killing the fungus. When I paired that with this process the process of killing the fungus sped up considerably. No more fungus",
    verified: true,
    productName: "Pentachom Photodynamic Laser Enhancer"
  }
];

const Reviews = () => {
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

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {review.author.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex mb-3">{renderStars(review.rating)}</div>
              <p className="text-sm text-muted-foreground mb-3">
                {review.content}
              </p>
              {review.productName && (
                <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                  {review.productName}
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