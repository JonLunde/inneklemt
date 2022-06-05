import { useTheme } from "next-themes";
import Image from "next/image";
import { ChangeEventHandler, useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useWindowSize from "../utils/useWindowSize";

const DarkMode = () => {
  // resolvedTheme can be used to avoid layout shifting somehow...
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { width } = useWindowSize();
  useEffect(() => {
    console.log("width", width);
  }, [width]);

  // To avoid hydration style mismatch.
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleChange = () => {
    if (resolvedTheme === "dark") setTheme("light");
    else setTheme("dark");
  };
  return (
    <DarkModeSwitch
      style={{ marginBottom: "2rem" }}
      checked={resolvedTheme === "dark"}
      onChange={handleChange}
      size={width && width < 640 ? 30 : 40}
      //! Add tailwind final theme colors.
      moonColor="#F8FFE6"
      sunColor="#171F03"
    />
  );
};

export default DarkMode;
