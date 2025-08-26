import { ReactNode } from "react";

type QRCodeLayoutProps = {
  children: ReactNode;
};

const QRCodeLayout = ({ children }: QRCodeLayoutProps) => {

  return (
    <>
      {/* Navbar ด้านบนแบบง่าย */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex justify-center items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Burapha University</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[80px]">
        {children}
      </div>
    </>
  );
};

export default QRCodeLayout;
