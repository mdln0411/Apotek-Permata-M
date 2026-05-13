import React from 'react';

const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    price: "Rp 15.000",
    stock: "Stok: 150",
    imageClass: "bg-[url(/image-paracetamol-500mg.png)]",
    imageAlt: "Paracetamol 500mg",
    cardClass:
      "w-[173px] h-[297px] gap-6 pt-[-1.7e-05px] pl-[1.35e-05px] pr-0 pb-0 absolute top-0 left-0 overflow-hidden flex flex-col items-start bg-white rounded-2xl border-[1.33px] border-solid border-[#2f8a5a33]",
    contentClass:
      "h-[100px] flex flex-col w-[170.33px] items-start gap-2 pt-3 pb-0 px-3 relative",
    titleRowClass:
      "flex h-5 items-start justify-around pl-0 pr-[19.94px] py-0 relative self-stretch w-full",
    titleWrapClass: "flex w-[126.4px] h-5 items-start relative overflow-hidden",
    priceWrapClass: "relative w-[69.83px] h-6",
    stockWrapClass: "flex w-[48.38px] h-4 items-start relative",
    stockTextClass:
      "mr-[-4.62px] relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-xs tracking-[0] leading-4 whitespace-nowrap",
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    price: "Rp 45.000",
    stock: "Stok: 80",
    imageClass: "bg-[url(/image-amoxicillin-500mg.png)]",
    imageAlt: "Amoxicillin 500mg",
    prescription: "Resep",
    cardClass:
      "w-[173px] h-[317px] gap-6 pt-[-1.7e-05px] pl-[1.35e-05px] pr-0 pb-0 absolute top-0 left-[185px] overflow-hidden flex flex-col items-start bg-white rounded-2xl border-[1.33px] border-solid border-[#2f8a5a33]",
    contentClass:
      "h-[120px] flex flex-col w-[170.33px] items-start gap-2 pt-3 pb-0 px-3 relative",
    titleRowClass:
      "flex h-10 items-start justify-between pr-[1.91e-05px] pl-0 py-0 relative self-stretch w-full",
    titleWrapClass: "relative w-[87.35px] h-10",
    titleTextClass:
      "absolute -top-px left-0 w-[70px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-sm tracking-[0] leading-5",
    badgeClass:
      "flex w-[50.98px] h-[22.67px] items-center justify-center gap-1 px-2 py-0.5 relative bg-[#8ccf8a] rounded-[10px] overflow-hidden border-[1.33px] border-solid border-transparent",
    badgeTextClass:
      "relative w-fit ml-[-0.51px] mr-[-0.51px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-xs tracking-[0] leading-4 whitespace-nowrap",
    priceRowClass:
      "flex h-6 items-center justify-between pr-[-2.29e-05px] pl-0 py-0 relative self-stretch w-full",
    priceWrapClass: "relative w-[72.62px] h-6",
    stockWrapClass: "flex w-[41.9px] h-4 items-start relative",
    stockTextClass:
      "mr-[-6.10px] relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-xs tracking-[0] leading-4 whitespace-nowrap",
  },
  {
    id: 3,
    name: "Vitamin C 1000mg",
    category: "Vitamins",
    price: "Rp 35.000",
    stock: "Stok: 200",
    imageClass: "bg-[url(/image-vitamin-c-1000mg.png)]",
    imageAlt: "Vitamin C 1000mg",
    cardClass:
      "w-[173px] h-[297px] gap-6 pt-[3.93e-06px] pl-[1.35e-05px] pr-0 pb-0 absolute top-[329px] left-0 overflow-hidden flex flex-col items-start bg-white rounded-2xl border-[1.33px] border-solid border-[#2f8a5a33]",
    contentClass:
      "h-[100px] flex flex-col w-[170.33px] items-start gap-2 pt-3 pb-0 px-3 relative",
    titleRowClass:
      "flex h-5 items-start justify-around pl-0 pr-[30.92px] py-0 relative self-stretch w-full",
    titleWrapClass:
      "flex w-[115.42px] h-5 items-start relative overflow-hidden",
    priceWrapClass: "relative w-[72.29px] h-6",
    stockWrapClass: "flex w-[48.38px] h-4 items-start relative",
    stockTextClass:
      "mr-[-6.62px] relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-xs tracking-[0] leading-4 whitespace-nowrap",
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    price: "Rp 25.000",
    stock: "Stok: 120",
    imageClass: "bg-[url(/image-ibuprofen-400mg.png)]",
    imageAlt: "Ibuprofen 400mg",
    cardClass:
      "w-[173px] h-[297px] gap-6 pt-[3.93e-06px] pl-[1.35e-05px] pr-0 pb-0 absolute top-[329px] left-[185px] overflow-hidden flex flex-col items-start bg-white rounded-2xl border-[1.33px] border-solid border-[#2f8a5a33]",
    contentClass:
      "h-[100px] flex flex-col w-[170.33px] items-start gap-2 pt-3 pb-0 px-3 relative",
    titleRowClass:
      "flex h-5 items-start justify-around pl-0 pr-[35.29px] py-0 relative self-stretch w-full",
    titleWrapClass:
      "flex w-[111.04px] h-5 items-start relative overflow-hidden",
    priceWrapClass: "relative w-[72.29px] h-6",
    stockWrapClass: "flex w-[48.38px] h-4 items-start relative",
    stockTextClass:
      "mr-[-4.62px] relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-xs tracking-[0] leading-4 whitespace-nowrap",
  },
];

export const FeaturedProductsSection = (): React.ReactElement => {
  return (
    <section
      aria-labelledby="featured-products-heading"
      className="flex flex-col h-[710px] items-start gap-4 pt-4 pb-0 px-4 relative self-stretch w-full"
    >
      <div className="flex h-9 items-center justify-between pr-[-1.53e-05px] pl-0 py-0 relative self-stretch w-full">
        <div className="relative w-[159.42px] h-[30px]">
          <h2
            id="featured-products-heading"
            className="absolute -top-0.5 left-0 [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-xl tracking-[0] leading-[30px] whitespace-nowrap"
          >
            Produk Unggulan
          </h2>
        </div>
        <button
          type="button"
          aria-label="Lihat semua produk unggulan"
          className="all-[unset] box-border flex w-[125.73px] h-9 items-center justify-center gap-2 px-4 py-2 relative rounded-[10px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8a5a]"
        >
          <span className="ml-[-3.14px] mr-[-3.14px] text-[#2f8a5a] relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
            Lihat Semua →
          </span>
        </button>
      </div>
      <div className="relative self-stretch w-full h-[626px]">
        {products.map((product) => (
          <article key={product.id} className={product.cardClass}>
            <div className="flex flex-col w-[170.33px] h-[170.33px] items-start relative bg-[#dcefd7]">
              <div
                role="img"
                aria-label={product.imageAlt}
                className={`relative self-stretch w-full h-[170.33px] ${product.imageClass} bg-cover bg-[50%_50%]`}
              />
            </div>
            <div className={product.contentClass}>
              <div className={product.titleRowClass}>
                <div className={product.titleWrapClass}>
                  <div
                    className={
                      product.titleTextClass ||
                      "relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-sm tracking-[0] leading-5 whitespace-nowrap"
                    }
                  >
                    {product.name}
                  </div>
                </div>
                {product.prescription ? (
                  <div
                    className={product.badgeClass}
                    aria-label={`Kategori khusus: ${product.prescription}`}
                  >
                    <div className={product.badgeTextClass}>
                      {product.prescription}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex h-4 items-start relative self-stretch w-full">
                <div className="relative flex-1 mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-xs tracking-[0] leading-4">
                  {product.category}
                </div>
              </div>
              <div
                className={
                  product.priceRowClass ||
                  "flex h-6 items-center justify-between relative self-stretch w-full"
                }
              >
                <div className={product.priceWrapClass}>
                  <div className="absolute -top-0.5 left-0 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#2f8a5a] text-base tracking-[0] leading-6 whitespace-nowrap">
                    {product.price}
                  </div>
                </div>
                <div className={product.stockWrapClass}>
                  <div className={product.stockTextClass}>{product.stock}</div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
