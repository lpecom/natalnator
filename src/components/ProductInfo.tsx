import React from "react";
import { toast } from "sonner";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";

const ProductInfo = () => {
  const handleBuy = () => {
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-black text-white px-2 py-1 rounded">
            ÚLTIMAS UNIDADES DA BLACK FRIDAY 🔥
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold">
          Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-2xl md:text-4xl font-bold">R$ 99,90</span>
        <span className="text-lg md:text-xl text-gray-500 line-through">R$ 187,00</span>
        <span className="text-white bg-primary px-2 py-1 text-sm font-bold rounded">
          -47%
        </span>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
        <Truck className="w-5 h-5 text-black flex-shrink-0" />
        <div>
          <p className="text-gray-600">Frete Grátis</p>
          <p className="text-success font-medium">2 a 5 dias úteis</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cor: <span className="text-primary">Dourada Noel</span>
          </label>
          <div className="flex gap-2">
            {["gold", "red", "silver"].map((color) => (
              <button
                key={color}
                className={`w-14 h-14 border-2 rounded ${
                  color === "gold" ? "border-primary" : "border-gray-200"
                }`}
                style={{
                  backgroundColor: color === "gold" ? "#FFD700" : color === "red" ? "#C41E3A" : "#C0C0C0"
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Altura: <span className="text-primary">1.80 m</span>
          </label>
          <div className="flex gap-2">
            {["1.80 m", "2.10 m"].map((size) => (
              <button
                key={size}
                className={`px-4 py-2 border-2 rounded font-medium text-sm ${
                  size === "1.80 m"
                    ? "border-primary text-primary"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleBuy}
        className="w-full bg-success hover:bg-success/90 text-white py-3 rounded-lg font-bold text-lg transition-colors"
      >
        COMPRAR AGORA
      </button>

      <div className="pt-4 space-y-4">
        <div className="border-t pt-4">
          <h3 className="text-center font-medium text-gray-600 mb-3 text-sm">
            FORMAS DE PAGAMENTO
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              "Visa",
              "Mastercard",
              "Pix",
              "Boleto",
            ].map((method) => (
              <div
                key={method}
                className="h-10 bg-gray-50 rounded-lg border flex items-center justify-center text-xs text-gray-600"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                {method}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 justify-center text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Pagamento 100% seguro</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;