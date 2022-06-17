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
    <button
      aria-label={
        resolvedTheme === "dark" ? "skru av mørkt tema" : "sku på mørkt tema"
      }
      onClick={handleChange}
    >
      <DarkModeSwitch
        style={{ marginBottom: "2rem" }}
        checked={resolvedTheme === "dark"}
        onClick={handleChange}
        onChange={handleChange}
        size={width && width < 600 ? 30 : 60}
        moonColor="#F6FBFF"
        sunColor="#ffc229"
      />
    </button>
  );
};

export default DarkMode;
