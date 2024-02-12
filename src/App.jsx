import { Suspense, lazy } from "react";

// Lazy load components
const Layer = lazy(() => import("./components/artLayer/Layer"));
const Canvas = lazy(() => import("./components/canvas/Canvas"));
const Header = lazy(() => import("./components/header/Header"));
const Scroller = lazy(() => import("./components/scroll/Scroller"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <Scroller />
      <Layer />
      <Canvas />
    </Suspense>
  );
}

export default App;