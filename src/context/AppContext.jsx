import { createContext, useContext, useEffect, useState } from "react"
import { fetchData } from "../data/fetchData";

const ContextApp = createContext();

export const UseAppContext = () => {
    return useContext(ContextApp);
}

const fillData = async() => {
  const results = await fetchData()
  return results
}


function AppContext({ children }) {
  const [state, setState] = useState({
    layer: false,
    menu: false,
    connectWallet: false,
    data: [],
    currentSquare: 0
  })

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fillData().then(results => {
      setState(state => ({
        ...state,
        data: results
      }));
      setLoading(false);
    })
  }, [])
  

  const updateState = (key, value) => {
    setState({
      ...state,
      layer: false,
      menu: false,
      connectWallet: false,
      [key]: value
    })
  }

  const updateKeys = (keys) => {
    setState({
      ...state,
      ...keys
    })
  }

  const process = {
    state,
    updateState,
    updateKeys,
    loading,
  }

  return (
    <ContextApp.Provider value={process}>
        {children}
    </ContextApp.Provider>
  )
}

export default AppContext