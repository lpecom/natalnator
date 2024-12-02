import React from "react";
import { toast } from "sonner";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ProductInfo = () => {
  const handleBuy = () => {
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-black text-white px-2 py-1 rounded">
            ÚLTIMAS UNIDADES DA BLACK FRIDAY 🔥
          </span>
          <span className="text-xs text-gray-500">156 VENDIDOS</span>
        </div>
        <h1 className="text-2xl font-bold">
          Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Código: 789123</span>
          <span>•</span>
          <span>12 avaliações</span>
        </div>
      </div>

      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-bold">R$ 99,90</span>
        <span className="text-xl text-gray-500 line-through">R$ 187,00</span>
        <span className="text-white bg-primary px-2 py-1 text-sm font-bold rounded">
          -47% OFF
        </span>
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Truck className="w-12 h-12 text-black flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Frete Grátis</h3>
          <p className="text-gray-600">Prazo de envio de 2 a 5 dias úteis</p>
          <p className="text-success font-medium">para Cotia, São Paulo e Região</p>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-center font-bold">
          QUEIMA TOTAL: ÚLTIMAS <span className="text-primary">8</span> UNIDADES
        </h3>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-primary rounded-full"></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base">
            Cor: <span className="text-primary">Vermelha Noel</span>
          </Label>
          <RadioGroup defaultValue="red" className="grid grid-cols-3 gap-2">
            {[
              { value: "gold", label: "Dourada", color: "#FFD700" },
              { value: "red", label: "Vermelha", color: "#C41E3A" },
              { value: "silver", label: "Prata", color: "#C0C0C0" },
            ].map((option) => (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={`color-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`color-${option.value}`}
                  className="flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-primary hover:border-primary/50"
                >
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base">
            Altura: <span className="text-primary">1.80 m</span>
          </Label>
          <RadioGroup defaultValue="1.80" className="grid grid-cols-2 gap-2">
            {[
              { value: "1.80", label: "1.80 m" },
              { value: "2.10", label: "2.10 m" },
            ].map((option) => (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={`size-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`size-${option.value}`}
                  className="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-primary peer-checked:text-primary hover:border-primary/50"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <button
        onClick={handleBuy}
        className="w-full bg-success hover:bg-success/90 text-white py-4 rounded-lg font-bold text-lg transition-colors uppercase"
      >
        Comprar Agora
      </button>

      <div className="space-y-6 pt-4">
        <div className="border-t pt-6">
          <h3 className="text-center font-medium text-gray-600 mb-4">
            FORMAS DE PAGAMENTO
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              "Visa",
              "Mastercard",
              "Hipercard",
              "Elo",
              "Amex",
              "Discover",
              "Pix",
              "Boleto",
            ].map((method) => (
              <div
                key={method}
                className="h-12 bg-gray-50 rounded-lg border flex items-center justify-center text-xs text-gray-600"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                {method}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 justify-center text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Pagamento 100% seguro</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Truck className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold">Frete Grátis</h4>
              <p className="text-gray-600 text-sm">
                Frete grátis em pedidos acima de R$99
              </p>
              <p className="text-gray-600 text-sm">
                Entrega realizada pelos Correios Brasileiro©
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold">Devoluções Gratuitas</h4>
              <p className="text-gray-600 text-sm">
                Estorno de 100% do seu dinheiro
              </p>
              <p className="text-gray-600 text-sm">
                7 dias após o recebimento da mercadoria
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;