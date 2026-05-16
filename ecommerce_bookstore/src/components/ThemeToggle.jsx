import React from "react";
import { useTheme, THEMES } from "../context/ThemeContext";
import toast from "react-hot-toast";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (key) => {
    setTheme(key);
    toast(`Switched to ${THEMES[key].name} theme`, { icon: THEMES[key].icon, duration: 1500 });
  };

  return (
    <div className={styles.themeToggle}>
      {Object.entries(THEMES).map(([key, { icon }]) => (
        <button
          key={key}
          className={`${styles.themeOption} ${theme === key ? styles.themeOptionActive : ""}`}
          onClick={() => handleThemeChange(key)}
          title={THEMES[key].name}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
