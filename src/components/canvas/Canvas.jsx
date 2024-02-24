import { useEffect } from "react";
import { UseAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

function Canvas() {
  const useAppContext = UseAppContext();
  const navigate = useNavigate();
  const howMany = useAppContext.state.data.length;

  const navigation = (route) => {
    navigate(route);
  };

  useEffect(() => {
    if (howMany !== 0) {
      // Dynamically import the callThreeJS function
      import("./parts/threeScripting")
        .then(({ callThreeJS }) => {
          // Ensure that callThreeJS is a named export in your threeScripting module
          callThreeJS(useAppContext, howMany, navigation);
        })
        .catch((error) => console.error("Failed to load the threeScripting module", error));
    }
  }, []);

  return (
    <div id="three-canvas" className="w-fit h-fit fixed top-0 left-0 bg-black">
      <>
        {howMany === 0 ? (
          <div className="text-7xl text-white w-screen h-screen flex flex-col items-center justify-center">
            <span className="loader"></span>
          </div>
        ) : null}
      </>
    </div>
  );
}

export default Canvas;
