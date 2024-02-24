import { useLocation, useNavigate } from "react-router-dom";
import { UseAppContext } from "../../../context/AppContext";
import { useEffect } from "react";

function SquareInfo() {
  const navigate = useNavigate();
  const { state, updateKeys, loading } = UseAppContext(); // Assuming UseAppContext returns an object with these properties
  const locationIDArray = useLocation().pathname.split("/");
  const locationID = locationIDArray[locationIDArray.length - 1];
  const data = state.data;

  const squareToShow = data.find((square) => square.id.toString() === locationID);

  useEffect(() => {
    if (locationID !== "") {
      setTimeout(() => {
        updateKeys({ layer: true });
        navigate(`/${locationID}`);
      }, 1000);
    }
    // console.log("data: ", data);
  }, [data, locationID]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : data.length < 1 ? null : squareToShow ? (
        <>
          <div id="square-picture" className="w-full md:w-1/2 h-1/3 md:h-full bg-black">
            <img className=" w-full h-full object-cover" src={squareToShow.url} alt="imgg" />
          </div>
          <div
            id="square-info"
            className="flex-1 flex-col w-full md:w-1/2 h-2/3 md:h-full bg-white text-black text-3xl pt-10 md:pt-24"
          >
            <div className="flex flex-col items-start px-10 text-xl overflow-auto">
              <h2 className="text-5xl italic">{squareToShow.nftName}</h2>
              <div className="flex flex-row items-center gap-x-3 text-sm mt-5">
                <h3 className="border-b border-black">Artist Name: {squareToShow.artist}</h3>
                <span>{/* @{squareToShow.user.instagram_username} */}</span>
              </div>
              {/* <p className="text-lg mt-10">
                {squareToShow.nftLink}
              </p> */}
              <ul className="grid grid-cols-2 md:grid-cols-2 gap-x-6 md:gap-x-16 content-center text-sm mt-10">
                <li>
                  Link:{" "}
                  <a href={squareToShow.nftLink} className="text-red-600 underline hover:cursor-pointer">
                    To See More Click Here
                  </a>
                </li>
              </ul>
              <hr className="w-[100%] border-gray-500 my-10" />
              <div className="w-full">
                <br />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("This is a demo by [EKinux] droplinked!");
                  }}
                  className="flex flex-row w-full text-sm gap-x-5"
                >
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered input-success px-2 py-3 w-2/3 text-white"
                  />
                  <button className="bg-black px-2 py-3 text-white w-1/3">PLACE BID</button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default SquareInfo;
