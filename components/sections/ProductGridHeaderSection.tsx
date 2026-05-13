import React from 'react';
import container from "./web1.svg";
// import container2 from "./container-2.svg";
// import image from "./image.svg";

const testimonials = [
  {
    name: "Budi Santoso",
    ratingSrc: container,
    ratingAlt: "Rating bintang 5",
    ratingClassName: "w-[88px] h-4",
    nameWidthClassName: "w-[95.31px]",
    quote: "Pelayanan cepat dan obat selalu tersedia. Sangat recommended!",
    quoteWidthClassName: "w-[301px]",
    date: "1/4/2026",
  },
  {
    name: "Siti Rahayu",
    ratingSrc: container,
    ratingAlt: "Rating bintang 5",
    ratingClassName: "w-[88px] h-4",
    nameWidthClassName: "w-[80.71px]",
    quote:
      "Harga terjangkau dan apotekernya sangat membantu memberikan informasi.",
    quoteWidthClassName: "w-[260px]",
    date: "28/3/2026",
  },
  {
    name: "Ahmad Wijaya",
    ratingSrc: container,
    ratingAlt: "Rating bintang 4",
    ratingClassName: "w-[70px] h-4",
    nameWidthClassName: "w-[105.27px]",
    quote: "Pengiriman cepat, kemasan rapi. Puas dengan layanan!",
    quoteWidthClassName: "w-[283px]",
    date: "25/3/2026",
  },
];

export const ProductGridHeaderSection = (): React.ReactElement => {
  return (
    <section
      aria-labelledby="testimoni-pelanggan-heading"
      className="flex flex-col h-[638px] items-start gap-4 pt-4 pb-0 px-4 relative self-stretch w-full"
    >
      <header className="relative self-stretch w-full h-[30px]">
        <h2
          id="testimoni-pelanggan-heading"
          className="absolute -top-0.5 left-0 [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-xl tracking-[0] leading-[30px] whitespace-nowrap"
        >
          Testimoni Pelanggan
        </h2>
      </header>
      <div className="flex flex-col h-[560px] items-start gap-3 relative self-stretch w-full">
        {testimonials.map((testimonial) => (
          <article
            key={`${testimonial.name}-${testimonial.date}`}
            className="h-[178.67px] gap-8 pl-4 pr-0 pt-4 pb-0 relative self-stretch w-full flex flex-col items-start bg-white rounded-2xl border-[1.33px] border-solid border-[#2f8a5a33]"
            aria-label={`Testimoni dari ${testimonial.name}`}
          >
            <div className="flex w-[323.33px] h-6 items-center justify-between relative">
              <div className={`${testimonial.nameWidthClassName} relative h-6`}>
                <h3 className="absolute -top-0.5 left-0 [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-base tracking-[0] leading-6 whitespace-nowrap not-italic">
                  {testimonial.name}
                </h3>
              </div>
              <img
                className={`relative ${testimonial.ratingClassName}`}
                alt={testimonial.ratingAlt}
                src={testimonial.ratingSrc}
              />
            </div>
            <div className="relative w-[323.33px] h-10">
              <p
                className={`absolute -top-px left-0 ${testimonial.quoteWidthClassName} [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-sm tracking-[0] leading-5`}
              >
                {testimonial.quote}
              </p>
            </div>
            <div className="flex w-[323.33px] h-4 items-start relative">
              <time
                dateTime={testimonial.date}
                className="relative flex-1 mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-xs tracking-[0] leading-4"
              >
                {testimonial.date}
              </time>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
