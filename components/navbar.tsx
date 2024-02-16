"use client"
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const logoClick = () => {
    router.push("/")
  };
  const onCLick = () => {
    router.push("/login")
  }
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-72 w-full">
        <p
          onClick={logoClick}
          className="shrink-0 flex items-center gap-x-2 font-bold text-xl  cursor-pointer"
        >
          POSTS
        </p>
        {/* <Button onClick={onCLick}>
            Login
        </Button> */}
      </div>
      
    </div>
  );
};

export default Navbar;
