"use client";

import { cn } from "@/lib/utils";

export type NavbarSectionIndicatorProps = {
  left: number;
  width: number;
  className?: string;
};

export function NavbarSectionIndicator({
  left,
  width,
  className,
}: NavbarSectionIndicatorProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-0 z-0 h-8 rounded-xl bg-black transition-[left,width] duration-300 ease-out dark:bg-white",
        className,
      )}
      style={{
        left: left - 8,
        width: width + 16,
        transform: "translateY(-30px)",
      }}
      aria-hidden
    />
  );
}
