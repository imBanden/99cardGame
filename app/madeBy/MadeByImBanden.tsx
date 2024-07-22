import { useState } from "react";

const MadeByImBanden = () => {
  const [buttonHover, setButtonHover] = useState<boolean>(false);
  return (
    <div className="flex flex-row gap-2 items-center pb-4">
      <p>made by</p>
      <a href="https://github.com/imBanden" target="_blank">
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          <div
            className={`w-[120px] h-[50px] border-2 border-black flex justify-center items-center cursor-pointer transition-all duration-300 font-bold relative z-10 text-lg ${
              buttonHover ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            <p>imBanden</p>
          </div>
          <div
            className={`w-[120px] h-[50px] top-2 left-2 absolute z-0 border-2 border-black transition-all duration-300 ${
              buttonHover ? "bg-white" : "bg-black"
            }`}
          />
        </div>
      </a>
    </div>
  );
};

export default MadeByImBanden;
