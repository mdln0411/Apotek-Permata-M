import React from 'react';
import vector from "./web1.svg";
// import vector2 from "./vector-2.svg";
// import vector3 from "./vector-3.svg";
// import vector4 from "./vector-4.svg";
// import vector5 from "./vector-5.svg";

const contactItems = [
  {
    id: "phone",
    label: "Telepon",
    value: "+62 812-3456-7890",
    contentWidth: "w-[123px]",
    valueClassName: "mr-[-13.27px]",
    icon: (
      <div className="flex absolute top-0.5 left-0 w-5 h-5" aria-hidden="true">
        <img className="flex-1 w-[16.57px]" alt="" src={vector} />
      </div>
    ),
    href: "tel:+6281234567890",
  },
  {
    id: "email",
    label: "Email",
    value: "info@apotekPermata.com",
    contentWidth: "w-[143px]",
    valueClassName: "mr-[-28.33px]",
    icon: (
      <div className="absolute top-0.5 left-0 w-5 h-5" aria-hidden="true">
        <img
          className="absolute w-[91.67%] h-[83.33%] top-[16.67%] left-[8.33%]"
          alt=""
          src={vector}
        />
        <img
          className="absolute w-[91.67%] h-[70.83%] top-[29.17%] left-[8.33%]"
          alt=""
          src={vector}
        />
      </div>
    ),
    href: "mailto:info@apotekPermata.com",
  },
  {
    id: "address",
    label: "Alamat",
    value: "Jl. KePermataan No. 123, Jakarta Selatan",
    contentWidth: "w-[229px]",
    valueClassName: "mr-[-42.65px]",
    icon: (
      <div className="absolute top-0.5 left-0 w-5 h-5" aria-hidden="true">
        <img
          className="absolute w-[83.33%] h-[91.67%] top-[8.33%] left-[16.67%]"
          alt=""
          src={vector}
        />
        <img
          className="absolute w-[62.50%] h-[70.83%] top-[29.17%] left-[37.50%]"
          alt=""
          src={vector}
        />
      </div>
    ),
  },
];

export const AboutPharmacySection = (): React.ReactElement => {
  return (
    <section
      className="flex flex-col h-[320.67px] items-start gap-4 pt-4 pb-0 px-4 relative self-stretch w-full"
      aria-labelledby="about-pharmacy-contact-heading"
    >
      <div className="relative self-stretch w-full h-[30px]">
        <h2
          id="about-pharmacy-contact-heading"
          className="absolute -top-0.5 left-0 [font-family:'Inter-Medium',Helvetica] font-medium text-[#1f2d24] text-xl tracking-[0] leading-[30px] whitespace-nowrap"
        >
          Hubungi Kami
        </h2>
      </div>
      <address className="not-italic h-[226.67px] gap-9 pl-4 pr-0 pt-4 pb-0 relative self-stretch w-full flex flex-col items-start bg-white rounded-2xl border-[1.33px] border-solid border-[#2f8a5a33]">
        {contactItems.map((item) => (
          <div key={item.id} className="relative w-[323.33px] h-10">
            {item.icon}

            <div
              className={`flex flex-col ${item.contentWidth} h-10 items-start absolute top-0 left-8`}
            >
              <div className="flex h-5 items-start relative self-stretch w-full">
                <div className="relative flex-1 mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-sm tracking-[0] leading-5">
                  {item.label}
                </div>
              </div>
              <div className="flex h-5 items-start relative self-stretch w-full">
                {item.href ? (
                  <a
                    href={item.href}
                    className={`relative w-fit mt-[-1.00px] ${item.valueClassName} [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-sm tracking-[0] leading-5 whitespace-nowrap focus:outline-none focus-visible:underline`}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p
                    className={`relative w-fit mt-[-1.00px] ${item.valueClassName} [font-family:'Inter-Regular',Helvetica] font-normal text-[#1f2d24] text-sm tracking-[0] leading-5 whitespace-nowrap`}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </address>
    </section>
  );
};
