"use client";

import { useEffect, useRef, useState } from "react";

import ThemeContext from "@/context/themeContext";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Load theme from local storage
  let themeFromStorage = useRef<boolean>(false);

  // Wait for the page to load on the client side before setting the theme
  useEffect(() => {
    themeFromStorage.current = localStorage?.getItem("hotel-theme")
      ? JSON.parse(localStorage.getItem("hotel-theme")!)
      : false;
  }, []);

  const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage.current);
  const [renderComponent, setRenderComponent] = useState(false);

  useEffect(() => {
    setRenderComponent(true);
  }, []);

  if (!renderComponent) return <></>;

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      <div className={`${darkTheme ? "dark" : ""} min-h-screen`}>
        <div className="dark:text-white dark:bg-black text-[#1E1E1E]">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
