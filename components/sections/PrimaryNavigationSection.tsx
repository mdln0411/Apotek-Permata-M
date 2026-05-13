import React from 'react';

export const PrimaryNavigationSection = (): React.ReactElement => {
  return (
    <header className="flex flex-col w-[390px] h-14 items-start pt-3 pb-0 px-4 absolute top-0 left-0 bg-[#2f8a5a] shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a]">
      <div className="relative self-stretch w-full h-8">
        <div className="flex w-[138px] h-8 items-center gap-2 absolute top-0 left-0">
          <div
            className="flex w-8 h-8 items-center justify-center pl-[2.25px] pr-[2.27px] py-0 relative rounded-[44739200px] bg-[url(/navbar.png)] bg-cover bg-[50%_50%]"
            aria-hidden="true"
          >
            <div className="relative w-[27.48px] h-7" />
          </div>
          <div className="relative w-[97.58px] h-6">
            <div className="absolute -top-0.5 left-0 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
              Apotek Permata
            </div>
          </div>
        </div>
        <div className="flex w-[150px] h-8 items-center gap-3 absolute top-0 left-52">
          <div
            className="flex-1 grow h-8 relative rounded-[10px]"
            aria-hidden="true"
          />
          <button
            type="button"
            aria-label="Masuk"
            className="all-[unset] box-border w-[65.81px] h-8 relative rounded-[10px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <div className="absolute top-1.5 left-5 [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
              Masuk
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
