"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

type Props = {
  className?: string;
  onHamburgerClick: () => void;
  navbar: boolean;
};

const Hamburger = (props: Props) => {
  const [navbar, setNavbar] = useState(false);

  return (
    <Button
      className="w-12 h-12 bg-neutral-50 dark:bg-neutral-700 "
      onClick={() => {
        props.onHamburgerClick();
      }}
    >
      {props.navbar ? (
        <MenuOpenIcon
          color="inherit"
          sx={{}}
          fontSize="large"
          className="transition-all dark:text-neutral-300 "
        />
      ) : (
        <MenuIcon
          fontSize="large"
          sx={{}}
          className="transition-all dark:text-neutral-300 "
        />
      )}
    </Button>
  );
};

export default Hamburger;
