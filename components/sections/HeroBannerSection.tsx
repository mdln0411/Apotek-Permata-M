import React from 'react';

const heroActions = [
  {
    label: "Lihat Obat",
    variant: "primary" as const,
    className:
      "flex w-[98.08px] h-9 items-center justify-center gap-2 px-4 py-2 bg-[#2f8a5a] relative rounded-[10px]",
    textClassName:
      "ml-[-1.96px] mr-[-1.96px] text-white relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-sm text-center tracking-[0] leading-5 whitespace-nowrap",
  },
  {
    label: "Pesan Sekarang",
    variant: "secondary" as const,
    className:
      "flex w-[134px] h-9 items-center justify-center gap-2 px-4 py-2 bg-[#f5faf4] border-[1.33px] border-solid border-white relative rounded-[10px]",
    textClassName:
      "relative w-fit mt-[-1.33px] ml-[-3.00px] mr-[-3.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-sm text-center tracking-[0] leading-5 whitespace-nowrap",
  },
];

export const HeroBannerSection = (): React.ReactElement => {
  return (
    <section
      aria-label="Hero banner apotek"
      className="relative self-stretch w-full h-[400px] bg-[url(/image-pharmacy.png)] bg-cover bg-[50%_50%]"
    >
      <div className="relative flex w-[390px] h-[400px] items-end bg-[linear-gradient(0deg,rgba(31,45,36,0.8)_0%,rgba(31,45,36,0.2)_100%)]">
        <div className="relative flex-1 grow h-[220px]">
          <div className="absolute top-6 left-6 flex w-[342px] h-[72px]">
            <h1 className="mt-[-2.7px] w-[318px] h-[72px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-2xl tracking-[0] leading-9">
              Solusi Obat Terpercaya untuk KePermataan Anda
            </h1>
          </div>
          <div className="absolute top-[104px] left-6 flex w-[342px] h-10 opacity-90">
            <p className="-mt-px w-[342px] h-10 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5">
              Apotek online terpercaya dengan berbagai pilihan obat berkualitas
              dan layanan profesional
            </p>
          </div>
          <div
            className="flex w-[342px] h-9 items-start gap-2 absolute top-40 left-6"
            role="group"
            aria-label="Aksi hero banner"
          >
            {heroActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={action.className}
                aria-label={action.label}
              >
                <span className={action.textClassName}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
