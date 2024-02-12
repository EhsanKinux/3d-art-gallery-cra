import { useEffect, useState } from "react";
import { UseAppContext } from "../../context/AppContext";
import { faShareSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Route, Routes, useNavigate } from "react-router-dom";
import SquareInfo from "./parts/SquareInfo";

function Layer() {
  const useAppContext = UseAppContext();
  const navigate = useNavigate();
  const [layerClass, setLayerClass] = useState("-z-[60] hidden");
  const [innerLayer, setInnerLayer] = useState("-translate-x-full");

  useEffect(() => {
    if (useAppContext.state.layer) {
      setLayerClass("z-[60] block");
      setTimeout(() => {
        setInnerLayer("translate-x-0");
      }, 100);
    } else {
      setInnerLayer("-translate-x-full");
      setTimeout(() => {
        setLayerClass("-z-[60] hidden");
      }, 500);
    }
  }, [useAppContext.state.layer]);

  const closeButton = () => {
    useAppContext.updateState("layer", false);
    navigate("/");
  };

  return (
    <div id="layer" className={`fixed top-0 mt-[50px] left-0 w-screen h-[95vh] text-white ${layerClass}`}>
      <div
        className={`w-full h-full bg-white text-white transition-transform duration-500 ${innerLayer} flex flex-row-reverse flex-wrap relative`}
      >
        <div className="w-full md:w-1/2 bg-white py-2 md:py-4 text-gray-700 text-md absolute top-0 left-0">
          <button className="float-left ms-5" onClick={closeButton}>
            <FontAwesomeIcon icon={faLeftLong} />
            &nbsp;&nbsp;GO BACK
          </button>
          <button className="float-right me-5">
            SHARE&nbsp;&nbsp;
            <FontAwesomeIcon icon={faShareSquare} />
          </button>
        </div>

        <Routes>
          <Route path="/*" element={<SquareInfo />} />
        </Routes>
        {/* <SquareInfo /> */}
      </div>
    </div>
  );
}

export default Layer;
