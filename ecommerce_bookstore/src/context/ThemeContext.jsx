import React, { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext();

export const THEMES = {
  default: {
    name: "Default",
    icon: "🌿",
    vars: {
      "--color-bg": "#054a51",
      "--color-surface": "#043a40",
      "--color-surface-elevated": "#065660",
      "--color-primary": "#ead58a",
      "--color-primary-hover": "#f7e6a6",
      "--color-primary-glow": "rgba(234, 213, 138, 0.15)",
      "--color-secondary": "#a4ceb3",
      "--color-accent": "#7fb89e",
      "--color-text-main": "#e7e4d1",
      "--color-text-muted": "#8bb3a1",
      "--color-text-subtle": "#5a8a76",
      "--color-danger": "#e74c3c",
      "--color-success": "#2ecc71",
    },
  },
  dark: {
    name: "Dark",
    icon: "🌙",
    vars: {
      "--color-bg": "#0a0f0d",
      "--color-surface": "#141c19",
      "--color-surface-elevated": "#1a2521",
      "--color-primary": "#c9a84c",
      "--color-primary-hover": "#ddb95d",
      "--color-primary-glow": "rgba(201, 168, 76, 0.15)",
      "--color-secondary": "#7fb89e",
      "--color-accent": "#4ecdc4",
      "--color-text-main": "#f0ede4",
      "--color-text-muted": "#8a9b93",
      "--color-text-subtle": "#566961",
      "--color-danger": "#e74c3c",
      "--color-success": "#2ecc71",
    },
  },
  light: {
    name: "Light",
    icon: "☀️",
    vars: {
      "--color-bg": "#f5f0e8",
      "--color-surface": "#ffffff",
      "--color-surface-elevated": "#faf8f4",
      "--color-primary": "#8b6914",
      "--color-primary-hover": "#a07a1a",
      "--color-primary-glow": "rgba(139, 105, 20, 0.1)",
      "--color-secondary": "#2a7a52",
      "--color-accent": "#1a8a7a",
      "--color-text-main": "#1a1a1a",
      "--color-text-muted": "#5a6660",
      "--color-text-subtle": "#8a9490",
      "--color-danger": "#c0392b",
      "--color-success": "#27ae60",
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("readhaven-theme") || "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeVars = THEMES[theme]?.vars || THEMES.default.vars;

    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set data attribute for any CSS that needs theme-specific rules
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("readhaven-theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    const keys = Object.keys(THEMES);
    const currentIndex = keys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % keys.length;
    setTheme(keys[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
