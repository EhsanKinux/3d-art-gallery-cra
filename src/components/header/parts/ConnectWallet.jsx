import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UseAppContext } from "../../../context/AppContext";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

function ConnectWallet() {
  const useAppContext = UseAppContext();
  const menuPosition = useAppContext.state.connectWallet
    ? "-translate-x-[125%] md:-translate-x-[110%]"
    : "translate-x-0";

  const closeModal = () => {
    useAppContext.updateState("connectWallet", false);
  };

  return (
    <div
      className={`w-2/3 h-fit md:w-96 md:h-96 bg-gray-900 text-white fixed top-32 left-[100vw] md:top-32 md:left-[100vw] transition-transform duration-1000 ${menuPosition} flex flex-col items-start gap-y-7 px-10 py-10 rounded-2xl border-green-500 border`}
    >
      <h3 className="font-bold">CONNECT YOUR WALLET</h3>
      <p className="text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ad mollitia asperiores inventore dolore id
        adipisci consectetur, dignissimos suscipit cumque, quibusdam illo quis et nihil provident minus fugit, placeat
        nam!
      </p>
      <button className="absolute top-5 right-5" onClick={closeModal}>
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <button
        onClick={() => alert("This is a demo by [EKinux]droplinked!")}
        className="bg-white text-black px-5 py-3 rounded-md md:hover:bg-green-500 duration-200"
      >
        CONNECT NOW
      </button>
    </div>
  );
}

export default ConnectWallet;
