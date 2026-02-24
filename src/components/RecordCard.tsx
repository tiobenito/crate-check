"use client";

import DemandBadge from "./DemandBadge";

interface RecordCardProps {
  artist: string;
  album: string;
  year?: string;
  lowestPriceMxn?: string;
  lowestPriceUsd?: string;
  demand?: string;
  coverImage?: string;
  discogsUrl?: string;
  onDelete?: () => void;
  onClick?: () => void;
  variant?: "grid" | "collection";
}

export default function RecordCard({
  artist,
  album,
  lowestPriceMxn,
  lowestPriceUsd,
  demand,
  coverImage,
  onDelete,
  onClick,
  variant = "grid",
}: RecordCardProps) {
  const isCollection = variant === "collection";
  const hoverClass = isCollection ? "coll-card-hover" : "card-hover";
  const vinylClass = isCollection ? "coll-vinyl-peek" : "grid-vinyl-peek";
  const artClass = isCollection ? "coll-art" : "grid-art";

  const price = lowestPriceMxn || lowestPriceUsd;

  return (
    <div
      className={`group cursor-pointer ${hoverClass}`}
      style={{
        background: "var(--card)",
        borderRadius: 16,
        border: "1px solid var(--border)",
        overflow: isCollection ? "hidden" : undefined,
        padding: isCollection ? undefined : 16,
      }}
      onClick={onClick}
    >
      {/* Art */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "100%",
          paddingTop: "100%",
          borderRadius: isCollection ? 0 : 10,
          marginBottom: isCollection ? 0 : 12,
        }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={`${artist} - ${album}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-350 ${artClass}`}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-5xl text-muted2 bg-card">
            <div className="vinyl-logo" style={{ width: 60, height: 60 }} />
          </div>
        )}
        <div className={vinylClass} />
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-none"
            style={{
              background: "rgba(253, 246, 227, 0.9)",
              color: "var(--muted)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--demand-low)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            title="Remove from collection"
          >
            &times;
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: isCollection ? 16 : 0 }}>
        <div
          className="text-terracotta font-bold uppercase truncate"
          style={{
            fontSize: isCollection ? "0.78rem" : "0.75rem",
            letterSpacing: "0.03em",
          }}
        >
          {artist}
        </div>
        <div
          className="font-display font-bold text-text truncate mt-0.5"
          style={{ fontSize: isCollection ? "1rem" : "0.92rem" }}
        >
          {album}
        </div>
        <div className="flex items-center justify-between mt-2">
          {price ? (
            <span
              className="font-mono font-semibold text-terracotta"
              style={{ fontSize: isCollection ? "0.92rem" : "0.85rem" }}
            >
              {price}
            </span>
          ) : (
            <span className="text-muted2 text-sm">No price</span>
          )}
          {demand && <DemandBadge demand={demand} size="small" />}
        </div>
      </div>
    </div>
  );
}
