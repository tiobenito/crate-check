"use client";

interface DemandBadgeProps {
  demand: string;
  size?: "default" | "small";
}

export default function DemandBadge({
  demand,
  size = "default",
}: DemandBadgeProps) {
  const level = demand.toLowerCase() as "high" | "good" | "medium" | "low";
  const validLevel = ["high", "good", "medium", "low"].includes(level)
    ? level
    : "medium";

  return (
    <span className={`demand-badge ${validLevel} ${size === "small" ? "small" : ""}`}>
      <span className="demand-dot" />
      {size === "small" ? demand : `${demand} Demand`}
    </span>
  );
}
