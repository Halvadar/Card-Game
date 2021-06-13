import React, { useEffect, useState } from "react";

const WindowInfo = () => {
  const [windowInfo, setWindowInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 768,
  });

  useEffect(() => {
    const resizeFunc = () => {
      setWindowInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
      });
    };
    window.addEventListener("resize", resizeFunc);
    return () => {
      window.removeEventListener("resize", resizeFunc);
    };
  });
  return { windowInfo };
};
export default WindowInfo;
