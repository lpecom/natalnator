import React from "react";
import { toast } from "sonner";
import { Truck, CreditCard, ShieldCheck, Barcode } from "lucide-react";

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

      {/* Free Shipping Banner */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Truck className="w-12 h-12 text-black flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Frete Grátis</h3>
          <p className="text-gray-500">Prazo de envio de 2 a 5 dias</p>
          <p className="text-green-500">para Cotia, São Paulo e Região</p>
        </div>
      </div>

      {/* Stock Alert */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-center font-bold">
          QUEIMA TOTAL: ÚLTIMAS <span className="text-primary">8</span> UNIDADES
        </h3>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-primary rounded-full"></div>
        </div>
      </div>

      {/* Product Options */}
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

      {/* Buy Button */}
      <button
        onClick={handleBuy}
        className="w-full bg-success hover:bg-success/90 text-white py-4 rounded-lg font-bold text-lg transition-colors uppercase"
      >
        Comprar Agora
      </button>

      {/* Payment Methods */}
      <div className="space-y-6 pt-4">
        <div className="border-t pt-4">
          <h3 className="text-center font-medium text-gray-600 mb-4">
            FORMAS DE PAGAMENTO
          </h3>
          <div className="flex gap-2 flex-wrap justify-center">
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
                className="w-24 h-12 bg-gray-50 rounded-lg border flex items-center justify-center text-xs"
              >
                <CreditCard className="w-5 h-5 mr-1" />
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-center gap-2 text-gray-500 justify-center">
          <ShieldCheck className="w-5 h-5" />
          <span>Pagamentos e informações estão seguros</span>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Truck className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold">Frete Grátis</h4>
              <p className="text-gray-500 text-sm">
                Frete grátis em pedidos acima de R$99
              </p>
              <p className="text-gray-500 text-sm">
                Entrega realizado pelos Correios Brasileiro©.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold">Devoluções Gratuitas</h4>
              <p className="text-gray-500 text-sm">
                Estorno de 100% do seu dinheiro
              </p>
              <p className="text-gray-500 text-sm">
                7 dias após o recebimento da mercadoria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;