"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopMobile() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Mobile uniquement
    if (window.innerWidth <= 768) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [pathname]);
  console.log("ScrollToTopMobile mounted");


  return null;
}
