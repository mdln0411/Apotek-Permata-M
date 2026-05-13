import React from 'react';

const benefits = [
  "Produk Original & Terjamin",
  "Apoteker Berpengalaman",
  "Pengiriman Cepat & Aman",
];

export const ProductCardGridSection = (): React.ReactElement => {
  return (
    <section
      className="flex flex-col h-[388.67px] items-start pt-4 pb-0 px-4 bg-[#dcefd74c] relative self-stretch w-full"
      aria-labelledby="tentang-apotek-permata-heading"
    >
      <div className="h-[356.67px] gap-9 pl-4 pr-0 pt-4 pb-0 relative self-stretch w-full flex flex-col items-start bg-white rounded-2xl border-[1.33px] border-solid border-[#2f8a5a33]">
        <div className="relative w-[323.33px] h-[30px]">
          <h2
            id="tentang-apotek-permata-heading"
            className="absolute -top-0.5 left-0 [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-xl tracking-[0] leading-[30px] whitespace-nowrap m-0"
          >
            Tentang Apotek Permata
          </h2>
        </div>
        <div className="relative w-[323.33px] h-[100px]">
          <p className="absolute -top-px left-0 w-[319px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-sm tracking-[0] leading-5 m-0">
            Apotek Permata adalah apotek online terpercaya yang telah melayani
            ribuan pelanggan di seluruh Indonesia. Kami menyediakan berbagai
            macam obat-obatan berkualitas dengan harga terjangkau dan layanan
            apoteker profesional.
          </p>
        </div>
        <ul className="flex flex-col w-[323.33px] h-[120px] items-start gap-2 pt-2 pb-0 px-0 relative list-none m-0">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex h-8 items-center gap-2 relative self-stretch w-full"
            >
              <div
                className="flex w-8 h-8 items-center justify-center relative bg-[#2f8a5a1a] rounded-[44739200px] shrink-0"
                aria-hidden="true"
              >
                <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  ✓
                </div>
              </div>
              <div className="flex h-5 items-start relative">
                <div className="relative w-fit mt-[-1.00px] whitespace-nowrap [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-sm tracking-[0] leading-5">
                  {benefit}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
