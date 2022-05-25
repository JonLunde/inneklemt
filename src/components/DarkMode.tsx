import { ChangeEventHandler, useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const DarkMode = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      setDark();
    } else {
      setLight();
    }
  };

  // 1
  const setDark = () => {
    // 2
    localStorage.setItem('theme', 'dark');

    // 3
    document.documentElement.setAttribute('data-theme', 'dark');
  };

  const setLight = () => {
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  };

  // 4
  const storedTheme = localStorage.getItem('theme');

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const defaultDark =
    storedTheme === 'dark' || (storedTheme === null && prefersDark);

  if (defaultDark) {
    setDark();
  }

  // 5
  const toggleTheme: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.checked) {
      setDark();
    } else {
      setLight();
    }
  };

  return (
    <DarkModeSwitch
      style={{ marginBottom: '2rem' }}
      checked={isDarkMode}
      onChange={toggleDarkMode}
      size={40}
      //   moonColor="red"
      //   sunColor="red"
    />
  );
};

export default DarkMode;
