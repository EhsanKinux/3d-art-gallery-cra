function Scroller({ children }) {
  return (
    <div id="scroller" className={`fixed h-[20000px]`}>
      {children}
    </div>
  );
}

export default Scroller;
