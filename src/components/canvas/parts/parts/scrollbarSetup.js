import Scrollbar from "smooth-scrollbar";

export function setupScrollbar(damping) {
  let scrollbar = Scrollbar.init(document.body, { renderByPixels: true, continuousScrolling: true, damping });
  // Limiting x scrolling
  scrollbar.limit.x = 0;
  return scrollbar;
}

export function setupInitialScroll(useAppContext, scrollbar, scrolling) {
  if (useAppContext.state.data.length > 0) {
    setTimeout(() => {
      scrollbar.scrollTo(0, 5, 10);
      setTimeout(() => {
        scrolling = false;
      }, 1000);
    }, 2000);
  }
}
