"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

type Props = {
  className?: string;
};

export const ThemeSwitcher = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="default"
      size="icon"
      className={` ${props.className} group transition-all bg-neutral-50 dark:bg-neutral-300 dark:hover:bg-sky-600 hover:bg-sky-600`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? (
        <Brightness4Icon className=" transition  " />
      ) : (
        <Brightness7Icon className=" transition   " />
      )}
    </Button>
  );
};
