"use client";

import { useEffect, useRef } from "react";

export default function useIntersectionObserver(callback) {
  const observerRef = useRef();

  const targetRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      if (observerRef.current && targetRef.current) {
        observerRef.current.unobserve(targetRef.current);
      }
    };
  }, [callback]);

  return targetRef;
}
