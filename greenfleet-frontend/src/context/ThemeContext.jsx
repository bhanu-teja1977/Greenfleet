import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'greenfleet-theme';
const ThemeContext = createContext(null);

function readTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.title = 'GreenFleet';
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme remains active for the current session if storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => setTheme(current => current === 'dark' ? 'light' : 'dark');

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
