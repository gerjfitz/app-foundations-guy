import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Layout uses an internal scroll container (<main>) rather than the window.
    // Ensure both are reset on every route change.
    requestAnimationFrame(() => {
      const container = document.getElementById("app-scroll-container");
      container?.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
