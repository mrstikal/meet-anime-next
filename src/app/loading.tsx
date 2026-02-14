"use client";

import { useEffect, useState } from "react";
import SearchOverlay from "@/components/SearchOverlay";

export default function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 500);
    return () => window.clearTimeout(t);
  }, []);

  return <SearchOverlay active={show} text="Loading..." />;
}