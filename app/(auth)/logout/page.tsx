"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/"), 100);
  }, []);
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Cerrando sesión...</h1>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <LinearProgress />
      </Box>
    </div>
  );
};

export default LogoutPage;
