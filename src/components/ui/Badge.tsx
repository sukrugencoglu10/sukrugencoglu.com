import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "yellow" | "pink" | "blue" | "purple" | "orange";
  className?: string;
}

const colorClasses = {
  yellow: "bg-yellow/15 text-yellow border border-yellow/30",
  pink: "bg-accent/10 text-accent border border-accent/20",
  blue: "bg-blue/10 text-blue border border-blue/20",
  purple: "bg-purple/10 text-purple border border-purple/20",
  orange: "bg-orange/10 text-orange border border-orange/20",
};

export default function Badge({
  children,
  color = "yellow",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        colorClasses[color],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
