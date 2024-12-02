import React from "react";
import { toast } from "sonner";

const ProductInfo = () => {
  const handleBuy = () => {
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-black text-white px-2 py-1">
            ÚLTIMAS UNIDADES DA BLACK FRIDAY 🔥
          </span>
          <span className="text-xs text-gray-500">156 VENDIDOS</span>
        </div>
        <h1 className="text-2xl font-bold">
          Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold">R$ 99,90</span>
        <span className="text-gray-500 line-through">R$ 187,00</span>
        <span className="text-white bg-primary px-2 py-1 text-sm rounded">
          -47%
        </span>
      </div>

      <div className="bg-green-50 p-4 rounded-lg flex items-center gap-2">
        <span className="text-success">5% OFF</span>
        <span>no pix</span>
        <span className="bg-success text-white text-xs px-2 py-1 rounded">
          +Envio Prioritário
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cor: Vermelha Noel
          </label>
          <div className="flex gap-2">
            {["gold", "red", "silver"].map((color) => (
              <button
                key={color}
                className={`w-16 h-16 border rounded ${
                  color === "red" ? "border-primary" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Altura: ALTURA ESCOLHIDA
          </label>
          <div className="flex gap-2">
            {["1.80 m", "2.10 m"].map((size) => (
              <button
                key={size}
                className={`px-4 py-2 border rounded ${
                  size === "1.80 m" ? "border-primary" : "border-gray-200"
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
        className="w-full bg-success hover:bg-success/90 text-white py-4 rounded-lg font-bold text-lg transition-colors"
      >
        COMPRAR AGORA
      </button>

      <div className="space-y-4 pt-4">
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">FORMAS DE PAGAMENTO</h3>
          <div className="flex gap-2 flex-wrap">
            {["visa", "mastercard", "pix", "boleto"].map((method) => (
              <div
                key={method}
                className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center"
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Calcule o prazo de entrega</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite seu CEP"
              className="flex-1 border rounded px-4 py-2"
            />
            <button className="bg-black text-white px-6 py-2 rounded">
              Calcular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;