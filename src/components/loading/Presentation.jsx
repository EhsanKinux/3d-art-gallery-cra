import { useEffect, useState } from "react";
import { UseAppContext } from "../../context/AppContext";

function Presentation() {
  const useAppContext = UseAppContext();
  const [presentation, setPresentation] = useState("z-[100] block bg-black text-white");
  const [presentationContent, setPresentationContent] = useState("translate-y-[100%] opacity-0");
  const [loader, setLoader] = useState("opacity-0");

  useEffect(() => {
    if (useAppContext.state.data.length === 0) {
      setTimeout(() => {
        setPresentationContent("translate-y-[0%] opacity-100");
        setTimeout(() => {
          setLoader("opacity-100");
          setPresentation("z-[100] block bg-gray-900 text-white");
        }, 1500);
      }, 500);
    }

    if (useAppContext.state.data.length > 0) {
      setTimeout(() => {
        setPresentationContent("-translate-y-[200%] opacity-0");
        setTimeout(() => {
          setPresentation("-z-[100] hidden opacity-0");
        }, 1500);
      }, 5000);
    }
  }, [useAppContext.state.data[0]]);

  return (
    <div
      id="presentation"
      className={`fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-end transition-all duration-500 ${presentation} gap-y-[45vh]`}
    >
      <div className="flex flex-col items-center gap-y-5 md:gap-y-10 w-screen md:w-fit">
        <div
          id="presentation-content"
          className={`flex flex-row items-center justify-center gap-x-[5vw] md:gap-x-10 text-xl md:text-3xl w-full md:w-fit h-fit ${presentationContent} transition-all duration-1000 ease-in-out`}
        >
          <div className="logo">3dGallery</div>
          <div>|</div>
          <h1 className="text-center p-0 m-0 richi-logo">
            <span className="text-gradient">droplinked</span>
          </h1>
        </div>
        <div className={`text-sm md:text-xl italic duration-1000 delay-500 ease-in-out ${presentationContent}`}>
          For <strong>company name</strong> requirement
        </div>
      </div>
      <span className={`loaderPresentation justify-self-end duration-500 ${loader}`}></span>
    </div>
  );
}

export default Presentation;
