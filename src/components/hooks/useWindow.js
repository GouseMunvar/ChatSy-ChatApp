import { useEffect, useState } from "react";

const getDeviceType = (width) => {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "laptop";
};

const useWindow = () => {
  const [device, setDevice] = useState(() =>
    typeof window !== "undefined"
  
      ? getDeviceType(window.innerWidth)
      : "laptop"
  );

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceType(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
};

export default useWindow;
