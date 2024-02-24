function Presentation() {
  return (
    <div
      id="presentation"
      className={`w-screen h-screen flex flex-col items-center justify-center z-[100] bg-black gap-6`}
    >
      <label htmlFor="progress-bar" className="text-white">
        Loading assets please wait...
      </label>
      <progress id="progress-bar" className="w-56" value="0" max="100"></progress>
      {/* <div className="text-center mt-4 badge badge-warning gap-2">Pictures will load progressively in sets of 4.</div> */}
      <div className="flex flex-col items-center gap-y-5 md:gap-y-10 w-screen md:w-fit">
        <div
          id="presentation-content"
          className={`flex flex-row items-center justify-center gap-x-[5vw] md:gap-x-10 text-xl md:text-3xl w-full md:w-fit h-fit $ transition-all duration-1000 ease-in-out`}
        >
          <div className="logo text-white">3dGallery</div>
          <div className="text-white">|</div>
          <h1 className="text-center p-0 m-0 richi-logo">
            <span className="text-gradient">droplinked</span>
          </h1>
        </div>
        {/* <div className={`text-white text-sm md:text-xl italic duration-1000 delay-500 ease-in-out `}>
          For <strong>company name</strong> requirement
        </div> */}
      </div>
    </div>
  );
}

export default Presentation;
