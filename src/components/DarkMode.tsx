import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useWindowSize from "../utils/useWindowSize";

const DarkMode = () => {
  // resolvedTheme can be used to avoid layout shifting somehow...
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { width } = useWindowSize();

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
      size={width && width < 640 ? 30 : 60}
      //! Add tailwind final theme colors.
      moonColor="#F6FBFF"
      sunColor="#ffc229"
    />
  );
};

export default DarkMode;
