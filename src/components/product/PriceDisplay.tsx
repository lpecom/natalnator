import React from "react";

interface PriceDisplayProps {
  price: number;
  originalPrice: number;
  pixDiscount?: number;
}

const PriceDisplay = ({ price, originalPrice, pixDiscount = 0.05 }: PriceDisplayProps) => {
  const pixPrice = price * (1 - pixDiscount);
  const pixSavings = price - pixPrice;

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-2xl md:text-4xl font-bold">R$ {price.toFixed(2)}</span>
        <span className="text-lg md:text-xl text-gray-500 line-through">R$ {originalPrice.toFixed(2)}</span>
        <span className="text-white bg-primary px-2 py-1 text-sm font-bold rounded">
          -47%
        </span>
      </div>

      <div className="inline-flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1 text-success">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor">
              <path d="M20.3873 7.1575L11.9999 12L3.61255 7.1575" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9999 3L20.3873 7.1575L11.9999 12L3.61255 7.1575L11.9999 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            5% OFF no pix
          </span>
        </div>
        <span className="px-2 py-0.5 bg-[#F2FCE2] text-success rounded-full text-xs font-medium">
          + Envio Prioritário
        </span>
      </div>
    </>
  );
};

export default PriceDisplay;