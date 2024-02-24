import React from "react";

const Loading = () => {
  return (
    <div
      id="loading"
      className={`fixed w-screen h-screen flex flex-col items-center justify-center z-[99] bg-black gap-6 opacity-50`}
    >
      <div className="w-screen h-screen flex items-center justify-center gap-2">
        <span className="text-lg font-bold text-white gap-6 shadow-yellow-50 bg-slate-800 rounded-md p-2">LOADING PICTURES...</span>
        {/* <span className="font-bold loading loading-spinner text-warning loading-lg"></span> */}
      </div>
    </div>
  );
};

export default Loading;
