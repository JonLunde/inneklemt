import { useTheme } from "next-themes";
import Image from "next/image";
import { ChangeEventHandler, useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const DarkMode = () => {
  // resolved theme can be used to avoid layout shifting somehow...
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // To avoid hydration style mismatch.
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleChange = () => {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  return (
    <DarkModeSwitch
      style={{ marginBottom: "2rem" }}
      checked={theme === "dark"}
      onChange={handleChange}
      size={40}
      //   moonColor="red"
      //   sunColor="red"
    />
  );
};

export default DarkMode;
