import { User, Truck, CheckCircle } from "lucide-react";

const steps = [
  { id: 1, name: "Dados Pessoais", icon: User },
  { id: 2, name: "Entrega", icon: Truck },
  { id: 3, name: "Confirmação", icon: CheckCircle },
];

interface CheckoutStepsProps {
  currentStep: number;
}

export const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  return (
    <nav aria-label="Progresso" className="mb-8 animate-fade-in">
      <ol className="flex items-center justify-center space-x-4 md:space-x-8">
        {steps.map((step, stepIdx) => {
          const StepIcon = step.icon;
          return (
            <li key={step.name} className="relative">
              {stepIdx !== steps.length - 1 && (
                <div
                  className={`absolute top-1/2 -translate-y-1/2 left-[calc(100%+8px)] md:left-[calc(100%+16px)] w-8 md:w-16 h-0.5 transition-colors duration-500 ${
                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
              <div className="relative flex flex-col items-center group">
                <span
                  className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-500 ${
                    currentStep >= step.id
                      ? "bg-primary text-white scale-110"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <StepIcon className="w-4 h-4 md:w-6 md:h-6" />
                </span>
                <span className="text-xs md:text-sm font-medium mt-2">{step.name}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};