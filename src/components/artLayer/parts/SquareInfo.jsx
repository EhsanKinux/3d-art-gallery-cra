import { useLocation, useNavigate } from "react-router-dom";
import { UseAppContext } from "../../../context/AppContext";
import { useEffect } from "react";

function SquareInfo() {
  const navigate = useNavigate();
  const useAppContext = UseAppContext();
  const locationIDArray = useLocation().pathname.split("/");
  const locationID = locationIDArray[locationIDArray.length - 1];
  const data = useAppContext.state.data;
  const filtering = data.filter((square) => square.id === locationID);
  const squareToShow = filtering[filtering.length - 1];
  const title = squareToShow !== undefined ? squareToShow.alt_description.toUpperCase() : "No title available";
  const firstName =
    squareToShow && squareToShow.user && squareToShow.user.first_name ? squareToShow.user.first_name.toUpperCase() : "";
  const lastName =
    squareToShow && squareToShow.user && squareToShow.user.last_name ? squareToShow.user.last_name.toUpperCase() : "";

  useEffect(() => {
    if (locationID !== "") {
      setTimeout(() => {
        useAppContext.updateKeys({ layer: true });
        navigate(`/${locationID}`);
      }, 1000);
    }
    // console.log("data: ", data);
  }, [data, locationID]);

  return (
    <>
      {useAppContext.loading ? (
        <div>Loading...</div>
      ) : data.length < 1 ? null : squareToShow ? (
        <>
          <div id="square-picture" className="fixed w-full md:w-1/2 h-1/3 md:h-full bg-black">
            <img
              className="w-full h-full object-cover"
              src={squareToShow.urls.regular}
              alt={squareToShow.description}
            />
          </div>
          <div
            id="square-info"
            className="flex flex-col w-full md:w-1/2 h-2/3 md:h-full bg-white text-black text-3xl pt-10 md:pt-24"
          >
            <div className="flex flex-col items-start px-10 text-xl overflow-auto">
              <h2 className="text-5xl italic">{title}</h2>
              <div className="flex flex-row items-center gap-x-3 text-sm mt-5">
                <h3 className="border-b border-black">
                  {firstName} {lastName}
                </h3>
                <span>@{squareToShow.user.instagram_username}</span>
              </div>
              <p className="text-lg mt-10">{squareToShow.description}</p>
              <ul className="grid grid-cols-2 md:grid-cols-2 gap-x-6 md:gap-x-16 content-center text-sm mt-10">
                <li>Creation date: {squareToShow.created_at}</li>
                <li>Likes: {squareToShow.likes}</li>
                <li>Width: {squareToShow.width}</li>
                <li>Height: {squareToShow.height}</li>
              </ul>
              <hr className="w-[100%] border-gray-500 my-10" />
              <div className="w-full">
                <p className="font-bold text-2xl text-gray-700">{squareToShow.likes} LIKECOIN</p>
                <div className="flex flex-row w-full items-center justify-between text-sm">
                  <p className="text-gray-700">STARTING PRICE</p>
                  <p className="text-gray-400">NO BIDDING HISTORY</p>
                </div>
                <br />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("This is a demo by [EKinux] droplinked!");
                  }}
                  className="flex flex-row w-full text-sm gap-x-5"
                >
                  <input type="text" className="border px-2 py-3 w-2/3" placeholder={squareToShow.likes} />
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
