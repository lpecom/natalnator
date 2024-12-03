import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onContinueShopping: () => void;
}

export const SuccessMessage = ({ onContinueShopping }: SuccessMessageProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur p-6 md:p-8 text-center animate-fade-in">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Order Confirmed!</h2>
      <p className="text-muted text-sm md:text-lg mb-6 md:mb-8 max-w-md mx-auto">
        Thank you for your order. We'll contact you shortly to confirm delivery details.
        Remember, you only pay when your order arrives!
      </p>
      <Button
        onClick={onContinueShopping}
        className="px-6 py-3 text-base md:text-lg font-medium rounded-xl"
      >
        Continue Shopping
      </Button>
    </Card>
  );
};