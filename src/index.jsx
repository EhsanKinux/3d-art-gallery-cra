import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppContext from "./context/AppContext";
import Presentation from "./components/loading/Presentation";
import Loading from "./components/loading/Loading";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
  // {
  //   path: "/:id",
  //   element: <Layer />
  // },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <AppContext>
      <Presentation />
      <Loading />
      <RouterProvider router={router} />
    </AppContext>
  // {/* </React.StrictMode> */}
);
