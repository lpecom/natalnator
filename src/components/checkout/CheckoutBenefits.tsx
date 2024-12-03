import { CreditCard, Shield, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: CreditCard,
    title: "Pay on Delivery",
    description: "Only pay when you receive your order!"
  },
  {
    icon: Shield,
    title: "100% Safe",
    description: "Your satisfaction guaranteed"
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "2-5 business days"
  }
];

export const CheckoutBenefits = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <Card key={index} className="p-4 md:p-6 hover-card bg-white/80 backdrop-blur">
            <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent-light flex items-center justify-center">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">{benefit.title}</h3>
              <p className="text-muted text-xs md:text-sm">{benefit.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};